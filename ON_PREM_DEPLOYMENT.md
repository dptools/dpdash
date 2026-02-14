# Running the Application On Premise with Docker Compose

## Prerequisites

1. Docker and Docker Compose should be installed on your system.
2. Port `27017/tcp` should be opened through `firewall-cmd` for external mongodb connection.
3. MGB mail relay server should be set in postfix configuration and postfix should be running.

## Setup Instructions

### In an MGB Provisioned VM

#### 1. Environment Configuration

i. Create a `.env` file in application root directory

ii. Copy the contents from `.env.sample`

iii. Set the following required variables:
   ```
   MONGODB_URI=mongodb://mongodb:27017/dpdmongo?authSource=admin
   SESSION_SECRET=<your-secure-session-secret>
   SMTP_HOST=MGB mail relay server
   SMTP_PORT=25
   SMTP_USER=
   SMTP_PASS=
   SMTP_REJECT_UNAUTHORIZED=false
   ADMIN_EMAIL=<admin-email>
   EMAIL_SENDER=<sender-email>
   HOME_URL=https://hostname.mgb.org
   IMPORT_API_USERS=<comma-separated-api-users>
   IMPORT_API_KEYS=<comma-separated-api-keys>
   ```

#### 2. Obtain official SSL certificate from rcc[dot]partners[dot]org

Obtain official SSL certificate from rcc[dot]partners[dot]org. You can just
download the certificate and key in your computer. You will need to upload
these to Nginx proxy manager using GUI later.

#### 3. Launch the Application

From the application root directory, run:

```bash
docker compose up
```

This will start all required services in background:

- nginx-proxy-manager (web server that allows configuring SSL certificates and proxy)
- node-app (application server)
- mongodb (database)

To run in detached mode:

```bash
docker compose up -d
```

To stop the application:

```bash
docker compose down
```

#### 4. Access the Application

First, you will have to set up Nginx proxy via http://hostname.mgb.org:81. Then you can access the application at https://hostname.mgb.org

i. Open up `81/tcp` port through `firewall-cmd` in hostname.mgb.org. Since the VM is head-less, this is the only way you can access
Nginx Proxy Manager from outside the VM.

ii. Access the Nginx Proxy Manager admin interface at: http://hostname.mgb.org:81

   - Default login: `admin@example.com` / `changeme`
   
   - Upload the official SSL certificate that you downloaded:
     <img width="1279" height="645" alt="Image" src="https://github.com/user-attachments/assets/38bb5e87-e807-48ae-82f0-b08952ce26ba" />

   - From Nginx Proxy Manager dashboard, add this proxy:
     
     <img width="494" height="550" alt="Image" src="https://github.com/user-attachments/assets/64a39fcf-e4dc-486e-9d38-f89fe495f410" />

   - From SSL tab, also attach the uploaded certificate to your domain.

iii. Access the application at: https://hostname.mgb.org
   - Upon signing up, you may get some `Forbidden` issues. But those should go away once the DPdash admin grants you access to some data.
   - Import data to mongodb and contact the DPdash admin to get access.


---


### In a Private Workstation

#### 1. Environment Configuration

i. Create a `.env` file in application root directory

ii. Copy the contents from `.env.sample`

iii. Set the following required variables:
   ```
   MONGODB_URI=mongodb://mongodb:27017/dpdmongo?authSource=admin
   SESSION_SECRET=<your-secure-session-secret>
   SMTP_HOST=<your-smtp-server>
   SMTP_PORT=25
   SMTP_USER=
   SMTP_PASS=
   ADMIN_EMAIL=<admin-email>
   EMAIL_SENDER=<sender-email>
   HOME_URL=https://dpdash.local
   IMPORT_API_USERS=<comma-separated-api-users>
   IMPORT_API_KEYS=<comma-separated-api-keys>
   ```

To find `SMTP_HOST`, send yourself an email from the server. Open the email within Outlook and `View`-->`View message details`.
Look for something like:

```
Received: from unknown (HELO pnl-xtreme.partners.org) ([170.123.12.123])
  by ob1.hc6077-55.iphmx.com
```

The last one is the `SMTP_HOST`.

#### 2. Local Domain Setup

The application is configured to use the hostname `dpdash.local`. Add this to your hosts file:

```
# On Linux/Mac: Edit /etc/hosts
# On Windows: Edit C:\Windows\System32\drivers\etc\hosts
127.0.0.1 dpdash.local
```

#### 3. Generate Self-Signed Certificate

Run the provided script to generate a self-signed certificate:

```bash
chmod +x make-cert.sh
./make-cert.sh
```

It will create two files in `certs/` directory:

```
$ ls certs/
selfsigned.crt  selfsigned.key
```

#### 4. Launch the Application

From the application root directory, run:

```bash
docker compose up
```

This will start all required services in background:

- nginx-proxy-manager (web server that allows configuring SSL certificates and proxy)
- node-app (application server)
- mongodb (database)

To run in detached mode:

```bash
docker compose up -d
```

To include the SMTP testing server:

```bash
docker compose --profile smtp up
```

To stop the application:

```bash
docker compose down
```

#### 5. Access the Application

First, you will have to set up Nginx proxy via http://dpdash.local:81. Then you can access the application at https://dpdash.local

i. Access the Nginx Proxy Manager admin interface at: http://dpdash.local:81

   - Default login: `admin@example.com` / `changeme`
   - Upload the custom SSL certificate that you created:
     <img width="1246" height="641" alt="image" src="https://github.com/user-attachments/assets/c071df30-8ecb-4f42-85a3-af12727c3050" />

   - From Nginx Proxy Manager dashboard, add this proxy:
     <img width="1249" height="674" alt="image" src="https://github.com/user-attachments/assets/9fc72a1e-28e1-4d59-9c8b-39ab9f63d480" />

   - Attach the SSL certificate:
     <img width="1245" height="535" alt="image" src="https://github.com/user-attachments/assets/af67841e-b603-4c27-add9-332979db118b" />
  

ii. Access the application at: https://dpdash.local/

   - Your browser will show a security warning because of the self-signed certificate. This is expected for local development.
   - Upon signing up, you may get some `Forbidden` issues. But those should go away once the DPdash admin grants you access to some data.
   - Import data to mongodb and contact the DPdash admin to get access.

##### Security Warning

Nginx Proxy Manager should not be exposed to the internet. It is recommended to run it behind another web server that handles authentication and SSL termination. It also isn't required for production, as you can configure SSL termination and authentication at the load balancer level. It is necessary for local development because the application uses secure cookies AND it is considered a best practice to route all traffic over https.


## Maintenance

### 1. Connecting directly to Mongo

Find the container ID of the mongo container with `docker ps` and then run `docker exec -it <container-id> /bin/bash` to get a terminal within the container. From there you can run `mongosh` to connect to the database.

Alternatively, you can download [mongosh](https://www.mongodb.com/try/download/shell) and connect directly as:

```
mongosh "mongodb://127.0.0.1:27017/dpdmongo?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.8"
```

### 2. Importing charts, configs, users

Due to Gnar company's changes in database structure, [this](https://github.com/AMP-SCZ/utility/blob/f84e3d5a211d5e10020c670994dd78e79f07fb17/dpdash_ci_cd/dpdash_ci_cd.sh#L22-L29) method of `mongoimport` no longer works. The new method is:

```
mongoimport --uri="mongodb://127.0.0.1:27017/dpdmongo?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.8" --collection=charts charts_20230728_ci_cd.json
mongoimport --uri="mongodb://127.0.0.1:27017/dpdmongo?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.8" --collection=configs configs_20230728_ci_cd.json
mongoimport --uri="mongodb://127.0.0.1:27017/dpdmongo?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.8" --collection=users users_20230728_ci_cd.json
```

The trailing JSONs can be obtained from rc-predict.partners.org's `mongoexport`.

<details>
   <summary>mongoexport</summary>
   
   ```
   mongoexport --ssl --sslCAFile=$state/ssl/ca/cacert.pem --sslPEMKeyFile=$state/ssl/mongo_client.pem --uri="mongodb://dpdash:$MONGO_PASS@$HOST:$PORT/dpdata?authSource=admin" --collection=charts --out=/tmp/charts_${datestamp}.json
   mongoexport --ssl --sslCAFile=$state/ssl/ca/cacert.pem --sslPEMKeyFile=$state/ssl/mongo_client.pem --uri="mongodb://dpdash:$MONGO_PASS@$HOST:$PORT/dpdmongo?authSource=admin" --collection=configs --out=/tmp/configs_${datestamp}.json
   mongoexport --ssl --sslCAFile=$state/ssl/ca/cacert.pem --sslPEMKeyFile=$state/ssl/mongo_client.pem --uri="mongodb://dpdash:$MONGO_PASS@$HOST:$PORT/dpdmongo?authSource=admin" --collection=users --out=/tmp/users_${datestamp}.json
   ```
   
</details>


### 2. Importing data

The `IMPORT_API_USERS` and `IMPORT_API_KEYS` environment variables are used to authenticate API requests to import data. You can use these credentials with the import script at https://github.com/AMP-SCZ/dpimport to import data to the database. The updated script is on the branch `381-update-import-script-to-json-payload` and can be run by creating a config file like so:

```yaml
api_url: http://your.app.example.com/api/v1/import/data/
api_user: importer
api_key: super_secret
```

And running the script with the following command:

```bash
python import.py -c config.yaml /PATH/TO/CSV/DATA
```
