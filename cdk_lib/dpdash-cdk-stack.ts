import * as cdk from 'aws-cdk-lib';
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as efs from "aws-cdk-lib/aws-efs";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as ses from "aws-cdk-lib/aws-ses";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as iam from "aws-cdk-lib/aws-iam";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as certificate_manager from "aws-cdk-lib/aws-certificatemanager";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import { Construct } from 'constructs';

const APP_NAME = "DpDash";

export class DpdashCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      },
      ...props,
    });
    let devCertArn
    let sesIdentityArn
    let devCert

    if (!process.env.BASE_DOMAIN || !process.env.ADMIN_EMAIL || !process.env.EMAIL_SENDER) {
      throw new Error('Missing required environment variables: BASE_DOMAIN, ADMIN_EMAIL, EMAIL_SENDER');
    }

    if (process.env.DEV_CERT_ARN) {
      devCertArn = process.env.DEV_CERT_ARN;
      sesIdentityArn = `arn:aws:ses:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:identity/${process.env.BASE_DOMAIN}`
    } else {
      const hostedZone = new route53.PublicHostedZone(this, `${APP_NAME}HostedZone`, {
        zoneName: process.env.BASE_DOMAIN
      });

      const devHostedZone = new route53.PublicHostedZone(this, `${APP_NAME}DevHostedZone`, {
        zoneName: `staging.${process.env.BASE_DOMAIN}`,
      });

      devCert = new certificate_manager.Certificate(this, `${APP_NAME}DevCertificate`, {
        domainName: `staging.${process.env.BASE_DOMAIN}`,
        validation: certificate_manager.CertificateValidation.fromDns(devHostedZone),
      });

      const identity = new ses.EmailIdentity(this, 'Identity', {
        identity: ses.Identity.publicHostedZone(hostedZone),
      });

      devCertArn = devCert.certificateArn;
      sesIdentityArn = `arn:aws:ses:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:identity/${identity.emailIdentityName}`
    }
    const secrets = {
      mongoDbUserDev: ecs.Secret.fromSsmParameter(ssm.StringParameter.fromSecureStringParameterAttributes(this, `${APP_NAME}MongoDbUser`, {
        parameterName: 'DPDASH_MONGODB_ADMIN_USER_DEV',
        version: 1,
      })),
      mongoDbPasswordDev: ecs.Secret.fromSsmParameter(ssm.StringParameter.fromSecureStringParameterAttributes(this, `${APP_NAME}MongoDbPassword`, {
        parameterName: 'DPDASH_MONGODB_ADMIN_PASSWORD_DEV',
        version: 1,
      })),
      sessionSecretDev: ecs.Secret.fromSsmParameter(ssm.StringParameter.fromSecureStringParameterAttributes(this, `${APP_NAME}SessionDevSecret`, {
        parameterName: 'DPDASH_SESSION_SECRET_DEV',
        version: 1,
      })),
      importApiUsersDev: ecs.Secret.fromSsmParameter(ssm.StringParameter.fromSecureStringParameterAttributes(this, `${APP_NAME}ImportApiUsers`, {
        parameterName: 'DPDASH_IMPORT_API_USERS_DEV',
        version: 1,
      })),
      importApiKeysDev: ecs.Secret.fromSsmParameter(ssm.StringParameter.fromSecureStringParameterAttributes(this, `${APP_NAME}ImportApiKeysDev`, {
        parameterName: 'DPDASH_IMPORT_API_KEYS_DEV',
        version: 1,
      })),
    }
    const vpc = new ec2.Vpc(this, `${APP_NAME}Vpc`, {
      availabilityZones: [`${cdk.Aws.REGION}a`, `${cdk.Aws.REGION}b`],
    });

    const efsSecurityGroup = new ec2.SecurityGroup(this,`${APP_NAME}DevEfsSg`, {
      vpc,
    });

    const mongoRepository = ecr.Repository.fromRepositoryName(this, `${APP_NAME}DevMongoRepository`, "mongo");
    const dpdashRepository = ecr.Repository.fromRepositoryName(this, `${APP_NAME}DevDpdashRepository`, "dpdash");

    const mongoTaskDefinition = new ecs.FargateTaskDefinition(this, `${APP_NAME}DevMongoTaskDefinition`, {
      memoryLimitMiB: 512,
      cpu: 256,
    });

    const fileSystem = new efs.FileSystem(this, `${APP_NAME}DevEfsFileSystem`, { 
      vpc,
      securityGroup: efsSecurityGroup,
      encrypted: true,
      vpcSubnets: {
        subnets: vpc.privateSubnets,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
     });

    const accessPoint = new efs.AccessPoint(this, `${APP_NAME}DevVolumeAccessPoint`,  {
      fileSystem: fileSystem,
   })

    mongoTaskDefinition.addVolume({
      name: "mongo-data",
      efsVolumeConfiguration: {
        fileSystemId: fileSystem.fileSystemId,
        authorizationConfig: {
          accessPointId: accessPoint.accessPointId,
          iam: "ENABLED", 
        },
        transitEncryption: "ENABLED",
      },
    });

    mongoTaskDefinition.addToTaskRolePolicy(
      new iam.PolicyStatement({
        actions: [
          'elasticfilesystem:ClientRootAccess',
          'elasticfilesystem:ClientWrite',
          'elasticfilesystem:ClientMount',
          'elasticfilesystem:DescribeMountTargets',
        ],
        resources: [
          fileSystem.fileSystemArn,
        ],
      })
    );
    
    mongoTaskDefinition.addToTaskRolePolicy(
      new iam.PolicyStatement({
        actions: ['ec2:DescribeAvailabilityZones'],
        resources: ['*'],
      })
    );
    
    const mongoContainer = mongoTaskDefinition.addContainer(`${APP_NAME}DevMongoContainer`, {
      image: ecs.ContainerImage.fromEcrRepository(mongoRepository, "5.0.21"),
      portMappings: [{ containerPort: 27017 }],        
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: `${APP_NAME}DevMongoContainer` }),
      secrets: {
        MONGO_INITDB_ROOT_USERNAME: secrets.mongoDbUserDev,
        MONGO_INITDB_ROOT_PASSWORD: secrets.mongoDbPasswordDev,
      },
    });

    mongoContainer.addMountPoints({
      containerPath: "/data/db",
      readOnly: false,
      sourceVolume: "mongo-data",
    });

    const mongoDevFargateService = new ecs.FargateService(this, `${APP_NAME}DevMongoFargateService`, {
      cluster: new ecs.Cluster(this, `${APP_NAME}DevMongoCluster`, {
        vpc,
        clusterName: 'dpDashDevMongoCluster',
      }),
      taskDefinition: mongoTaskDefinition,
      desiredCount: 1,
      assignPublicIp: false,
    });

    const mongoNetworkLoadBalancer = new elbv2.NetworkLoadBalancer(this, `${APP_NAME}DevMongoNetworkLoadBalancer`, {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      internetFacing: false,
    });

    const mongoNlbListener = mongoNetworkLoadBalancer.addListener(`${APP_NAME}DevMongoListener`, {
      port: 27017,
      protocol: elbv2.Protocol.TCP,
    });

    const mongoDevServiceTarget = mongoDevFargateService.loadBalancerTarget({
      containerName: `${APP_NAME}DevMongoContainer`,
      containerPort: 27017,
    });      

    mongoNlbListener.addTargets(`${APP_NAME}DevMongoListenerTarget`, {
      port: 27017,
      protocol: elbv2.Protocol.TCP,
      targets: [mongoDevServiceTarget],
    });


    const mongoDevServiceLbSg = new ec2.SecurityGroup(this, "NLBSecurityGroup", { vpc });

    const cfnlb = mongoNetworkLoadBalancer.node.defaultChild as elbv2.CfnLoadBalancer;
    
    cfnlb.addPropertyOverride("SecurityGroups", [mongoDevServiceLbSg.securityGroupId]);

    efsSecurityGroup.addIngressRule(
        mongoDevFargateService.connections.securityGroups[0],
        ec2.Port.tcp(2049) // Enable NFS service within security group
    )

    mongoDevFargateService.connections.allowFrom(
      mongoDevServiceLbSg,
      ec2.Port.tcp(27017),
      "Allow inbound access from MongoDb NLB"
    )

    const appTaskDefinition = new ecs.FargateTaskDefinition(this, `${APP_NAME}DevAppTaskDefinition`, {
      family: 'dpDashDevTaskDefinition',
      taskRole: new iam.Role(this, `${APP_NAME}DevAppTaskRole`, {
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        inlinePolicies: {
          sendEmail: new iam.PolicyDocument({
            statements: [
              new iam.PolicyStatement({
                actions: ['ses:SendEmail', 'ses:SendRawEmail'],
                resources: [sesIdentityArn],
              }),
            ],
          })
        }
      })
    })

    appTaskDefinition.addContainer(`${APP_NAME}DevAppContainer`, {
      image: ecs.ContainerImage.fromEcrRepository(dpdashRepository, "latest"),
      portMappings: [{ containerPort: 8000}],
      environment: {
        MONGODB_HOST: mongoNetworkLoadBalancer.loadBalancerDnsName,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        EMAIL_SENDER: process.env.EMAIL_SENDER,
        HOME_URL: `https://staging.${process.env.BASE_DOMAIN}`,
      },
      secrets: {
        MONGODB_USER: secrets.mongoDbUserDev,
        MONGODB_PASSWORD: secrets.mongoDbPasswordDev,
        SESSION_SECRET: secrets.sessionSecretDev,
        IMPORT_API_USERS: secrets.importApiUsersDev,
        IMPORT_API_KEYS: secrets.importApiKeysDev,
      },
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: `${APP_NAME}DevAppContainer` }),
    });
    
    const dpDashDevService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, `${APP_NAME}DevAppService`, {
      serviceName: 'dpDashDevService',
      loadBalancerName: 'dpDashDevLoadBalancer',
      cluster: new ecs.Cluster(this, `${APP_NAME}DevCluster`, {
        vpc,
        clusterName: 'dpDashDevCluster',
      }),
      taskDefinition: appTaskDefinition,
      assignPublicIp: true,
      publicLoadBalancer: true,
      redirectHTTP: true,
      certificate: devCert || certificate_manager.Certificate.fromCertificateArn(this, `${APP_NAME}DevCertificate`, devCertArn),
      taskSubnets: {
        subnets: vpc.publicSubnets.concat(vpc.privateSubnets),
      },
    });

    mongoDevServiceLbSg.addIngressRule(
      dpDashDevService.service.connections.securityGroups[0],
      ec2.Port.tcp(27017),
      "Allow inbound access to MongoDb"
    )
  }
}
