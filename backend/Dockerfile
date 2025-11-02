# Backend (Express)
FROM node:20-alpine
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

EXPOSE 3001
CMD ["npm", "start"]
