# Local Development Using Docker

## Requirements

- Download Docker
- Set up local ENV Variables
- Import Data

## Docker

Download Docker for your os type [Docker Website](https://www.docker.com/)

## Set Up ENV Variables

- Create a .env file
- Add these [variables to your file ](/.env.sample)
- Create a env.development file
- Add these [variables to your file ](/.env.development.sample)
- Ask a Team Member for the values and an export of their `dpdash-mongodb` volume

## Import Data

Create a new docker volume with the `dpdash-mongodb`.

```sh
docker volume create dpdash-mongodb
```

Create a container to hold the volume
```sh
 docker run -v dpdash-mongodb:/dpdash-mongodb --name mongo_restore ubuntu /bin/bash
```

Unpack the `backup.tar` file into the volume.

```sh
 docker run --rm --volumes-from mongo_restore -v $(pwd):/backup ubuntu bash -c "cd /dpdash-mongodb   && tar xvf /backup/backup.tar --strip 1"

```
## Start the project

- Once Set up, use the command `docker compose up`


## For Onboarding: Export Data

Spin up a container with the volume. Use Ubuntu because we gotta keep Mongo from writing to it.

```sh
 docker run -v dpdash-mongodb:/dpdash-mongodb --name mongo_backup ubuntu /bin/bash
```

Copy the volume contents to `./backup.tar`

```sh
docker run --rm --volumes-from mongo_backup -v $(pwd):/backup ubuntu tar cvf /backup/backup.tar /dpdash-mongodb
```


