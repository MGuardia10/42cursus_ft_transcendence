# Take the image of node (20-alpine is light)
FROM node:20-alpine

# Create the app folder and set as workdir
# RUN		mkdir -p /app
WORKDIR	/app

# Copy the dependencies and install them
COPY	package.json package-lock.json ./
RUN		npm install

# Container port. It is not util with docker-compose
EXPOSE	3000

# Execute nodemon
# ENTRYPOINT [ "sleep", "infinity" ]
ENTRYPOINT [ "npm", "run", "dev" ]
