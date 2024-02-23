import { createTemplate } from './test/fixtures'
import { DpdashCdkStack } from './dpdash-cdk-stack'

describe('DPDashCDKStack', () => {
  const OLD_ENV = process.env
  const setEnv = (overrides = {}) => {
    process.env = {
      CDK_DEFAULT_ACCOUNT: '000000000000',
      CDK_DEFAULT_REGION: 'us-east-1',
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

  it('creates an Application Load Balanced Fargate Service', () => {
    setEnv()
    const template = createTemplate(DpdashCdkStack)

    template.hasResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {})
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

  describe('when the DPDASH_INFRA_STAGING flag is set to "1"', () => {
    it('creates a Hosted Zone', () => {
      setEnv()
      const template = createTemplate(DpdashCdkStack)
      template.hasResource('AWS::Route53::HostedZone', {})
    })

    it('creates a Certificate', () => {
      setEnv()
      const template = createTemplate(DpdashCdkStack)
      template.hasResource('AWS::CertificateManager::Certificate', {})
    })

    it('creates an SES Email Identity', () => {
      setEnv()
      const template = createTemplate(DpdashCdkStack)
      template.hasResource('AWS::SES::EmailIdentity', {})
    })

    it('creates a public Application Load Balanced Fargate Service', () => {
      setEnv()
      const template = createTemplate(DpdashCdkStack)

      template.hasResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
        'Properties': {
          'Scheme': 'internet-facing'
        }
      })
    })
  })
  describe('when the DPDASH_INFRA_STAGING flag is not set to "1"', () => {
    it('throws an error if the CERT_ARN and SES_IDENTITY_ARN are missing', () => {
      setEnv({ DPDASH_INFRA_STAGING: undefined })
      expect(() => createTemplate(DpdashCdkStack)).toThrowError("Missing required environment variables: CERT_ARN, SES_IDENTITY_ARN")
    })

    it('creates a private Application Load Balanced Fargate Service', () => {
      setEnv({ DPDASH_INFRA_STAGING: undefined, CERT_ARN: 'foo', SES_IDENTITY_ARN: 'bar' })
      const template = createTemplate(DpdashCdkStack)

      template.hasResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
          'Properties': {
            'Scheme': 'internal'
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
  })
})
