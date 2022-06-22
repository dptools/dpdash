# Local DP Dash development on Mac

This document outlines the set up necessary to run the application on a Mac computer.


## Requirements

  * [Complete all the steps up to the initialize step](./README-PNL.md#initialize)

# Install Dependencies

The following are the external dependencies required to run dpdash.

## MongoDB

To install mongodb manually follow the instructions [listed here](https://www.mongodb.com/docs/manual/installation/).

A simpler way to install mongodb is through homebrew.

```sh 
brew tap mongodb/brew
```
```sh
brew update
```
```sh
brew install mongodb-community@5.0
```

Homebrew will start the services automatically for you. For more information on installing mongodb through homebrew follow the instructions [here](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/).

## Rabbitmq 

Rabbitmq is also used in this project and it must run on your machine. A generic build for UNIX with instructions on how to install is found [here](https://www.rabbitmq.com/install-generic-unix.html).

There is a homebrew formulae to install rabbit mq. 
To install it through homebrew follow these steps or click [here](https://www.rabbitmq.com/install-homebrew.html)

```sh
brew update
```
```sh
brew install rabbitmq
```

## Prepare the Configs:

* Copy the contents from the dashboard directory.
* Create a directory called configs inside the server directory of the project.
* Open the basePathConfig.js and replace it's contents with this.

```js 
const basePathConfig = '';

export default basePathConfig;
```

* Comment lines 32-35. It should look like this.

```js
config.database.mongo.server = {};
config.database.mongo.server.ssl = false;
// config.database.mongo.server.sslCA = ca;
// config.database.mongo.server.sslCert = cert;
// config.database.mongo.server.sslKey = key;
// config.database.mongo.server.sslValidate = false;
config.database.mongo.server.reconnectTries = 1;
config.database.mongo.server.useNewUrlParser = true;
```

# Create Admin Users

[The init.sh script](./README-PNL.md#initialize) outputs a dashboard directory. The directory should be in this path ${state}/dpdash/configs/dashboard.

## Mongo User

Copy the mongo.username and mongo.password values from the /server/configs/config.js file.

```js
config.database.mongo.username = "dpdash";
config.database.mongo.password = "Some Value"
```

Start the mongo shell.

```sh
mongo
```

In the mongo shell enter the following.

```mongo
use admin
```

```mongo
db.createUser(
   {
     user: "dpdash",
     pwd: "Some Value"
     roles: [ "dbOwner" ]
   }
)
```

## Rabbit MQ user

Copy the config.rabbitmq.user and config.rabbitmq.password from the /server/configs.config.js file.

```js
config.rabbitmq.username = "dpdash";
config.rabbitmq.password = "password123";
```

Then on your terminal add the username and password.

```sh
sudo rabbitmqctl add_user dpdash password123
```

Set the administrator tag to the user.

```sh
sudo rabbitmqctl set_user_tags dpdash administrator
```

Set permissions.

```sh
sudo rabbitmqctl set_permissions -p / dpdash ".*" ".*" ".*"
```

If you'd like a sanity check, rabbit can list the users.

```sh
rabbitmqctl list_users --formatter=json
```

it should look like this

```sh
[
{"user":"dpdash","tags":["administrator"]}
,{"user":"guest","tags":["administrator"]}
]
```

## Install Project Depencies and Build

Almost there. To get the project to work do the following.

```sh
npm i 
```

When the depencies are installed you should be able to run the development environment

```sh
npm run dev
```

## Troubleshooting

### Port is already in use
It's a rare issue, but if it happens do the following.

```sh
killall node && npm run dev
```
