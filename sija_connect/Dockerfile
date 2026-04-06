# Gunakan image node yang ringan
FROM node:20-alpine

# Tentukan working directory
WORKDIR /app

# Copy file package untuk install dependensi dulu (optimasi build)
COPY package*.json ./
RUN npm install --production

# Copy seluruh source code backend
COPY . .

# Expose port 5000 (sesuai kebiasaan di laporan praktikum kamu)
EXPOSE 5000

# Jalankan aplikasi
CMD ["node", "app.js"]