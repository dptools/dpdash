import * as cdk from 'aws-cdk-lib';
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as efs from "aws-cdk-lib/aws-efs";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as iam from "aws-cdk-lib/aws-iam";
import * as certificate_manager from "aws-cdk-lib/aws-certificatemanager";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import { Construct } from 'constructs';

const APP_NAME = "DpDash";

export class DpdashCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    if (process.env.DEV_CERT_ARN) {
      const devCertificatArn = process.env.DEV_CERT_ARN;

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
  
      const mongoService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, `${APP_NAME}MongoService`, {
        vpc: vpc,
        cpu: 512,
        taskDefinition: mongoTaskDefinition,
        taskSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        listenerPort: 27017,
        maxHealthyPercent: 100,
        minHealthyPercent: 0,
        desiredCount: 1,
        assignPublicIp: false,
        publicLoadBalancer: false,
      });
  
  
      mongoService.targetGroup.configureHealthCheck({
        port: "27017",
      });
  
      
      efsSecurityGroup.addIngressRule(
          mongoService.service.connections.securityGroups[0],
          ec2.Port.tcp(2049) // Enable NFS service within security group
      )

      const appTaskDefinition = new ecs.FargateTaskDefinition(this, `${APP_NAME}DevAppTaskDefinition`, {
        family: 'dpDashDevTaskDefinition',
      })

      appTaskDefinition.addContainer(`${APP_NAME}DevAppContainer`, {
        image: ecs.ContainerImage.fromEcrRepository(dpdashRepository, "latest"),
        portMappings: [{ containerPort: 8000}],
        environment: {
          MONGODB_HOST: mongoService.loadBalancer.loadBalancerDnsName,
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
      
      new ecs_patterns.ApplicationLoadBalancedFargateService(this, `${APP_NAME}DevAppService`, {
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
        certificate: certificate_manager.Certificate.fromCertificateArn(this, `${APP_NAME}DevCertificate`, devCertificatArn),
        taskSubnets: {
          subnets: vpc.publicSubnets.concat(vpc.privateSubnets),
        },
      });
    } else {
      throw new Error("CertificateArn is not defined")
    }
  }
}
