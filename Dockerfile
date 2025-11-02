# Frontend (Angular) dev server
FROM node:20-alpine
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy app sources (exclude backend via .dockerignore)
COPY angular.json tsconfig.json index.tsx index.html metadata.json ./
COPY src ./src

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
