# Take the image of node (18-alpine is light)
FROM node:18

# Create the app folder and set as workdir
# RUN		mkdir -p /app
WORKDIR	/app

# Copy the dependencies and install them
COPY	package*.json ./
RUN		npm install

# Container port. It is not util with docker-compose
EXPOSE	3000

# Execute nodemon
ENTRYPOINT [ "npm", "run", "dev" ]
