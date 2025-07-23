FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN prisma generate && next build
EXPOSE 3000
CMD ["npm", "start"]