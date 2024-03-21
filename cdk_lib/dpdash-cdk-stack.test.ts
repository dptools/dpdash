import { createTemplate } from './test/fixtures'
import { DpdashCdkStack } from './dpdash-cdk-stack'

describe('DPDashCDKStack', () => {
  const OLD_ENV = process.env
  const setEnv = (overrides = {}) => {
    process.env = {
      CDK_DEFAULT_ACCOUNT: '000000000000',
      CDK_DEFAULT_REGION: 'us-east-1',
      CERT_ARN: 'aws:certarn',
      SES_IDENTITY_ARN: 'aws:sesarn',
      EMAIL_SENDER: 'noreply@dpdash.example.com',
      ADMIN_EMAIL: 'alice@example.com',
      BASE_DOMAIN: 'dpdash.example.com',
      APP_MEMORY: '2048',
      APP_CPU: '1024',
      DPDASH_INFRA_STAGING: '1',
      ...overrides
    }
  }

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('throws an error if the CERT_ARN and SES_IDENTITY_ARN are missing', () => {
    setEnv({ CERT_ARN: undefined, SES_IDENTITY_ARN: undefined })
    expect(() => createTemplate(DpdashCdkStack)).toThrowError("Missing required environment variables: CERT_ARN, SES_IDENTITY_ARN")
  })

  it('creates a VPC', () => {
    setEnv()
    const template = createTemplate(DpdashCdkStack)

    template.hasResource('AWS::EC2::VPC', {})
  })

  it('creates a DocumentDB Cluster', () => {
    setEnv()
    const template = createTemplate(DpdashCdkStack)

    template.hasResource('AWS::DocDB::DBCluster', {})
    template.hasResource('AWS::DocDB::DBInstance', {})
  })

  describe('when the DPDASH_INFRA_STAGING flag is set to "1"', () => {

  it('creates a public Application Load Balanced Fargate Service with Dev names', () => {
    setEnv()
    const template = createTemplate(DpdashCdkStack)

    template.hasResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      'Properties': {
        'Scheme': 'internet-facing'
      }
    })
    template.hasResource('AWS::ECS::Cluster', {
      'Properties': {
        'ClusterName': 'dpDashDevCluster'
      }
    })
    template.hasResource('AWS::ECS::Service', {
      'Properties': {
        'ServiceName': 'dpDashDevService'
      }
    })
    template.hasResource('AWS::ECS::TaskDefinition', {
      'Properties': {
        'Family': 'dpDashDevTaskDefinition'
      }
    })
  })
    it('uses the _DEV suffix for secret names', () => {
      setEnv()
      const template = createTemplate(DpdashCdkStack)

      template.hasResource('AWS::ECS::TaskDefinition', {
        'Properties': {
          'ContainerDefinitions': [
            {
              "Secrets": [
                {
                  "Name": "MONGODB_PASSWORD",
                  "ValueFrom": {
                    "Ref": "DocumentDBPassword52497A47"
                  }
                },
                {
                  "Name": "SESSION_SECRET",
                  "ValueFrom": {
                    "Fn::Join": [
                      "",
                      [
                        "arn:",
                        {
                          "Ref": "AWS::Partition"
                        },
                        ":ssm:us-east-1:000000000000:parameter/DPDASH_SESSION_SECRET_DEV"
                      ]
                    ]
                  }
                },
                {
                  "Name": "IMPORT_API_USERS",
                  "ValueFrom": {
                    "Fn::Join": [
                      "",
                      [
                        "arn:",
                        {
                          "Ref": "AWS::Partition"
                        },
                        ":ssm:us-east-1:000000000000:parameter/DPDASH_IMPORT_API_USERS_DEV"
                      ]
                    ]
                  }
                },
                {
                  "Name": "IMPORT_API_KEYS",
                  "ValueFrom": {
                    "Fn::Join": [
                      "",
                      [
                        "arn:",
                        {
                          "Ref": "AWS::Partition"
                        },
                        ":ssm:us-east-1:000000000000:parameter/DPDASH_IMPORT_API_KEYS_DEV"
                      ]
                    ]
                  }
                }
              ]
            }
          ]
        }
      })
    })
  })
  describe('when the DPDASH_INFRA_STAGING flag is not set to "1"', () => {

    it('creates a public Application Load Balanced Fargate Service with production names', () => {
      setEnv({ DPDASH_INFRA_STAGING: undefined })
      const template = createTemplate(DpdashCdkStack)
  
      template.hasResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
        'Properties': {
          'Scheme': 'internet-facing'
        }
      })
      template.hasResource('AWS::ECS::Cluster', {
        'Properties': {
          'ClusterName': 'dpDashCluster'
        }
      })
      template.hasResource('AWS::ECS::Service', {
        'Properties': {
          'ServiceName': 'dpDashService'
        }
      })
      template.hasResource('AWS::ECS::TaskDefinition', {
        'Properties': {
          'Family': 'dpDashTaskDefinition'
        }
      })
    })
    it('does not use the _DEV suffix for secret names', () => {
      setEnv({ DPDASH_INFRA_STAGING: undefined })
      const template = createTemplate(DpdashCdkStack)

      template.hasResource('AWS::ECS::TaskDefinition', {
        'Properties': {
          'ContainerDefinitions': [
            {
              "Secrets": [
                {
                  "Name": "MONGODB_PASSWORD",
                  "ValueFrom": {
                    "Ref": "DocumentDBPassword52497A47"
                  }
                },
                {
                  "Name": "SESSION_SECRET",
                  "ValueFrom": {
                    "Fn::Join": [
                      "",
                      [
                        "arn:",
                        {
                          "Ref": "AWS::Partition"
                        },
                        ":ssm:us-east-1:000000000000:parameter/DPDASH_SESSION_SECRET"
                      ]
                    ]
                  }
                },
                {
                  "Name": "IMPORT_API_USERS",
                  "ValueFrom": {
                    "Fn::Join": [
                      "",
                      [
                        "arn:",
                        {
                          "Ref": "AWS::Partition"
                        },
                        ":ssm:us-east-1:000000000000:parameter/DPDASH_IMPORT_API_USERS"
                      ]
                    ]
                  }
                },
                {
                  "Name": "IMPORT_API_KEYS",
                  "ValueFrom": {
                    "Fn::Join": [
                      "",
                      [
                        "arn:",
                        {
                          "Ref": "AWS::Partition"
                        },
                        ":ssm:us-east-1:000000000000:parameter/DPDASH_IMPORT_API_KEYS"
                      ]
                    ]
                  }
                }
              ]
            }
          ]
        }
      })
    })
  })
})
