START=$(pwd)

dev:
	docker compose --env-file .env.development up

close:
	docker compose --env-file .env.development down --rmi all
