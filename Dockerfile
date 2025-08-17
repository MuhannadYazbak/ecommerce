# Base image with Node.js and Playwright dependencies
FROM mcr.microsoft.com/playwright:v1.54.1-jammy 

# Set working directory
WORKDIR /app

# Set arguments
ARG RESEND_API_KEY
ARG DB_PASSWORD
ARG LOCATIONIQ_KEY

# Copy package files and install dependencies
COPY .env.docker .env.docker
COPY .env.local .env.local
COPY package*.json ./
COPY playwright.config.ts ./
COPY public/ ./public/
COPY src/ ./src/
RUN npm install
RUN npx playwright install --with-deps
ENV CI=true

# Expose dev server port
EXPOSE 3000

# Default command (can be overridden)
CMD ["npm", "run", "dev"]