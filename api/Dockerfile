# Dockerfile

# Usar una imagen base de Node.js
FROM node:16

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Instalar nodemon globalmente
RUN npm install -g nodemon

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto en el que corre la aplicación
EXPOSE 3001

# Comando para correr la aplicación en desarrollo
CMD ["npm", "run", "start:dev"]
