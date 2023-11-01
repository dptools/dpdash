### 1. Request DNS Certificate

### This step is only necessary if your domain is not hosted in AWS Route53. If it is, proceed directly to step 3

AWS Documentation: https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html

For this step you will require two things:

1. A domain name for the DP Dash application
2. The ability to set CNAME records for that domain which reference AWS DNS names

Log in to your AWS console and navigate to the Certificate Manager service.

![Screenshot of the AWS Certificate Manager link](/doc/assets/aws_setup/01_request_certificate//create_certificate_01.png)

Click the Request button in the top right corner.

![Screenshot of the Request Certificate button](/doc/assets/aws_setup/01_request_certificate//create_certificate_02.png)

Select "Request a public certificate".

![Screenshot of the Request Certificate form](/doc/assets/aws_setup/01_request_certificate//create_certificate_04.png)

Enter the fully qualified domain name at which the DP Dash app will be hosted, e.g. `dpdash.mydomain.com` if using a subdomain. Leave all other settings unchanged and click "Request".

AWS will provide a CNAME record to add to your DNS records. Set this record in the management system for your domain and AWS will automatically verify it and create your certificate.

![Screenshot of CNAME values for certificate verification](/doc/assets/aws_setup/01_request_certificate//create_certificate_05.png)

Copy the ARN of the issued certificate and save it locally. We will use it when configuring the deployment for your environment.

![Screenshot of ARN for certificate](/doc/assets/aws_setup/01_request_certificate//create_certificate_06.png)

### 2. Verify an email identity with Simple Email Service

### This step is only necessary if your domain is not hosted in AWS Route53. If it is, proceed directly to step 3

AWS Documentation: https://docs.aws.amazon.com/ses/latest/dg/creating-identities.html#just-verify-domain-proc

On the AWS Simple Email Service dashboard, navigate to "Verified Identities" and select "Create Identity". 

![Screenshot of the SES Verified Identities page](/doc/assets/aws_setup/02_verify_email_domain/verify_email_domain_01.png)

On the Create Identity form, select Identity Type of Domain and a domain of your root domain (e.g. `dpdash.com` even if hosting at `app.dpdash.com`).

![Screenshot of the SES Create Domain page](/doc/assets/aws_setup/02_verify_email_domain/verify_email_domain_02.png)

Select Create Identity. On the page for the new identity, scroll down to the "Publish DNS Records" section and select Download CSV Record Set at the bottom of the section. Set all of these records in the DNS records for your domain and wait for AWS to automatically verify domain ownership.

![Screenshot of the Download CSV Record Set link](/doc/assets/aws_setup/02_verify_email_domain/verify_email_domain_03.png)

Save the domain you used locally. We will use it when configuring the deployment for your environment.

### 3. Create AWS Role for Github Actions

AWS Documentation: https://aws.amazon.com/blogs/security/use-iam-roles-to-connect-github-actions-to-actions-in-aws/

Navigate to the IAM service in the AWS Console.

![Screenshot of the IAM link](/doc/assets/aws_setup/03_create_github_role/create_github_role_01.png)

Select "Roles" from the IAM Dashboard and click the Create button.

![Screenshot of IAM dashboard](/doc/assets/aws_setup/03_create_github_role/create_github_role_02.png)

For Trusted Entity select "Web Identity". For Identity Provider select "token.actions.githubusercontent.com". For Audience select "sts.amazonaws.com". Enter your Github Organization Name and the repo you wish to grant access to. Click "Create".

![Screenshot of role creation form with values filled out](/doc/assets/aws_setup/03_create_github_role/create_github_role_03.png)

Copy the ARN of the new role and save it locally. We will use it when configuring the deployment for your environment.

### 4. Bootstrap the CDK and Generate Secrets

This step will only need to be completed if the CDK has not been bootstrapped for your account/AWS environment. Ensure you are logged in via the AWS CLI. From the root of the project directory run:

```bash
npm i
npm run bootstrap
```

Create secret values in AWS encrypted SSM Parameter store:

```bash
export DPDASH_MONGODB_ADMIN_USER_DEV=dpdash
export DPDASH_IMPORT_API_USERS_DEV=dev-api-user
./bin/generate-secrets.sh
```

Secret values can be retrieved and decryted via the `./bin/echo-secrets.sh` script. THIS WILL LOG SECRET VALUES TO THE CONSOLE.

### 5. Build and Deploy Docker Images

Run the following commands from the root of this repository:

```bash
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account")
docker pull mongo:5.0.21
docker build -t dpdash:latest .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
docker tag mongo:5.0.21 $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/mongo:5.0.21
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/mongo:5.0.21

docker tag dpdash:latest $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/dpdash:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/dpdash:latest
```

### 6. Set Github Action Variables and Deploy

Github Documentation: https://docs.github.com/en/actions/learn-github-actions/variables#creating-configuration-variables-for-a-repository

Navigate to your Github repository and select the Settings tab. Open the "Secrets and Variables" menu on the left-hand side and select "Actions", then "New Variable".

![Screenshot of the Github Settings Menu](/doc/assets/aws_setup/06_set_github_variables/set_github_variables_01.png)

![Screenshot of Github Actions Variables](/doc/assets/aws_setup/06_set_github_variables/set_github_variables_02.png)

Create 2 variables:
1. Create the variable ROLE_ARN with a value of the ARN of your Role from Step 3.
2. Create the variable EMAIL_DOMAIN with the root domain you will use to host the app (e.g. `dpdash.com`). If you use an outside DNS rather than Route53, this will be the domain used in Step 2.

If you keep your domain outside of Route53, create one more variable:

1. Create the variable CERT_ARN with a value of the ARN of your AWS Certificate from Step 1.

Navigate to the Actions tab and the Deploy Infrastructure workflow. Select "Run Workflow". The application will deploy.

![Screenshot of Actions tab with Run Workflow button](/doc/assets/aws_setup/06_set_github_variables/set_github_variables_03.png)

### 7. Check the Deployment and Set CNAME Record

To verify that the application is deployed, view the DNS name with the following command:

```bash
aws elbv2 describe-load-balancers --names dpDashDevLoadBalancer --query "LoadBalancers[0].DNSName"
```

Visit this domain in your browser via `https://`. You will get a warning from your browser that the certificate is incorrect. This is the expected behavior and means that the server is responding appropriately. It is not necessary to override the browser warning

You may then set a CNAME record in your DNS system for the intended domain of this application, and direct requests to the URL retrieved from the above command.
