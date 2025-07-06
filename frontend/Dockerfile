# 1) STAGE: Build con Node
FROM node:20-alpine

WORKDIR /app

# Recibimos las variables de entorno en build-time
ARG VITE_API_BASEURL
ARG VITE_FRONTEND_BASEURL_EXTERNAL
ARG VITE_AUTH_API_BASEURL_EXTERNAL
ARG VITE_USER_API_BASEURL_EXTERNAL
ARG VITE_PONG_API_BASEURL_EXTERNAL
ARG VITE_GOOGLE_CALLBACK_URI
ARG VITE_AVATAR_FOLDER
ARG VITE_DEFAULT_LANGUAGE
ARG VITE_POINTS_TO_WIN
ARG VITE_SERVE_DELAY
ARG VITE_FIELD_COLOR
ARG VITE_STICK_COLOR
ARG VITE_BALL_COLOR

# Copiamos package.json y lock para cachear npm install
COPY package.json package-lock.json ./

# Copiamos el script que exporta las env vars para Vite
COPY tools/env.sh /env.sh
RUN chmod +x /env.sh

# Ejecutamos el env.sh para generar un .env.local que Vite consumirá
RUN \
  VITE_API_BASEURL="$VITE_API_BASEURL" \
  VITE_FRONTEND_BASEURL_EXTERNAL="$VITE_FRONTEND_BASEURL_EXTERNAL" \
  VITE_AUTH_API_BASEURL_EXTERNAL="$VITE_AUTH_API_BASEURL_EXTERNAL" \
  VITE_USER_API_BASEURL_EXTERNAL="$VITE_USER_API_BASEURL_EXTERNAL" \
  VITE_PONG_API_BASEURL_EXTERNAL="$VITE_PONG_API_BASEURL_EXTERNAL" \
  VITE_GOOGLE_CALLBACK_URI="$VITE_GOOGLE_CALLBACK_URI" \
  VITE_AVATAR_FOLDER="$VITE_AVATAR_FOLDER" \
  VITE_DEFAULT_LANGUAGE="$VITE_DEFAULT_LANGUAGE" \
  VITE_POINTS_TO_WIN="$VITE_POINTS_TO_WIN" \
  VITE_SERVE_DELAY="$VITE_SERVE_DELAY" \
  VITE_FIELD_COLOR="$VITE_FIELD_COLOR" \
  VITE_STICK_COLOR="$VITE_STICK_COLOR" \
  VITE_BALL_COLOR="$VITE_BALL_COLOR" \
  sh /env.sh

# Instalamos dependencias
RUN npm install 2> /dev/null

# Instalamos 'serve' globalmente
RUN npm install -g serve

# Generamos la build
COPY . .
RUN npm run build

# Exponemos el puerto que usará serve
EXPOSE 8080

# Por defecto, serve escucha en 5000, pero con -l podemos forzar el 8080
CMD ["serve", "-s", "dist", "-l", "8080"]

