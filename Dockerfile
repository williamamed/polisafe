# Usar la imagen oficial de Node.js
FROM node:18-alpine


# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json (o yarn.lock)
COPY package*.json ./

# Instalar dependencias
RUN npm install -g @nestjs/cli
RUN npm ci --only=production

# Copiar el código fuente
COPY . .

# Compilar la aplicación (si es TypeScript)
RUN rm .env
#RUN npm run migrate:refresh
# Exponer el puerto que usa NestJS (por defecto 3000)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "docker:start"]
