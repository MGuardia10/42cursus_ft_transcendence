all: up

# Rule to set up the system
up: certs
	@if [ ! -f .env ]; then \
		echo "\e[31m[ ERROR ]\e[0m A '.env' file must exist"; \
		exit 1; \
	fi
	@docker compose up --build #-d

# Rule to turn off the services and delete the containers
down:
	@docker-compose down

certs:
	@if [ ! -f nginx/certs/cert.pem ] || [ ! -f nginx/certs/key.pem ]; then \
		cd nginx/certs && bash generate_certs.sh; \
	fi

# Targets
.PHONY: up down certs