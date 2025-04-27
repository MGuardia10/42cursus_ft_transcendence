all: up

# Rule to set up the system
up: certs check_env
	@docker compose up --build #-d

check_env:
	@if [ ! -f .env ]; then \
		echo "\e[31m[ ERROR ]\e[0m A '.env' file must exist"; \
		exit 1; \
	fi

	@python3 check_env.py; \
	STATUS=$$?; \
	if [ $$STATUS -eq 1 ]; then \
		echo "\e[31m[ ERROR ]\e[0m The system could not be started because the '.env' file is invalid or missing required environment variables"; \
		exit 1; \
	fi


# Rule to turn off the services and delete the containers
down:
	@docker-compose down

# Rule to create the certs if there are not anyone
certs:
	@if [ ! -f nginx/certs/cert.pem ] || [ ! -f nginx/certs/key.pem ]; then \
		cd nginx/certs && bash generate_certs.sh; \
	fi

# Rule to clean all the user data
clean_data:
	@cd backend-user; rm -rf database.sqlite avatars
	@cd backend-auth; rm -rf database.sqlite

# Targets
.PHONY: up check_env down certs clean_data