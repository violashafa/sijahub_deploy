FROM node:20-alpine

WORKDIR /app

# Salin package.json dari root folder sija_connect
COPY package*.json ./
RUN npm install --production

# Salin seluruh isi folder sija_connect ke dalam /app di container
COPY . .

# Beritahu Docker bahwa file utamamu ada di dalam sub-folder backend/src/
CMD ["node", "server.js"]