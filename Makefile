all: up

# Rule to set up the system
up: certs
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