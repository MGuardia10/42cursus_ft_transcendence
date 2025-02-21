all: up

# Rule to set up the system
up:
	@docker compose up --build #-d

# Rule to turn off the services and delete the containers
down:
	@docker-compose down

# Targets
.PHONY: up down