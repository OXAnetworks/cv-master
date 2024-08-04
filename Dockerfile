# Usa la imagen base node:20.15.0-alpine
FROM node:20.15.0-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Instala ImageMagick, Ghostscript, y otras dependencias necesarias
RUN apk update && apk add --no-cache \
    imagemagick \
    ghostscript \
    poppler-utils \
    graphicsmagick \
    libc6-compat \
    bash

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

RUN npm run build

# Expone el puerto que usa la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
