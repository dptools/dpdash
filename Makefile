START=$(pwd)

docker-dev:
	docker-compose --env-file .env.development up

docker-close:
	docker-compose --env-file .env.development down --rmi all
