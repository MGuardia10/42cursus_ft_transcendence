# Take the image of node (20-alpine is light)
FROM node:20-alpine

# Create the app folder and set as workdir
WORKDIR	/app

# ARGs (build-time)
ARG VITE_API_BASEURL
ARG VITE_AUTH_API_BASEURL_EXTERNAL
ARG VITE_USER_API_BASEURL_EXTERNAL
ARG VITE_GOOGLE_CALLBACK_URI
ARG VITE_AVATAR_FOLDER

# Copy the dependencies and env script
COPY	package.json package-lock.json ./
COPY	tools/env.sh /

# Create environment
RUN		chmod +x /env.sh
RUN		VITE_API_BASEURL="$VITE_API_BASEURL" \
		VITE_AUTH_API_BASEURL_EXTERNAL="$VITE_AUTH_API_BASEURL_EXTERNAL" \
		VITE_USER_API_BASEURL_EXTERNAL="$VITE_USER_API_BASEURL_EXTERNAL" \
		VITE_GOOGLE_CALLBACK_URI="$VITE_GOOGLE_CALLBACK_URI" \
		VITE_AVATAR_FOLDER="$VITE_AVATAR_FOLDER" \
		sh /env.sh

# Install dependencies
RUN		npm install 2> /dev/null 

# Container port. It is not util with docker-compose
EXPOSE	5173

# Execute nodemon
ENTRYPOINT [ "npm", "run", "dev" ]
