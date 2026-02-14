START=$(pwd)

dev:
    docker compose --env-file .env.development up

dev-smtp:
    docker compose --env-file .env.development --profile smtp up

close:
    docker compose --env-file .env.development down --rmi all
