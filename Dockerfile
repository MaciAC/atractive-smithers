FROM node:18-alpine
WORKDIR /app
COPY package*.json .npmrc ./
# Set CI=true to skip husky installation
ENV CI=true
RUN npm ci --omit=dev
COPY . .
RUN prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]