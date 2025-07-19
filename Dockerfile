# Base image with Node.js and Playwright dependencies
FROM mcr.microsoft.com/playwright:v1.54.1-jammy 

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY .env.docker .env.local
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Expose dev server port
EXPOSE 3000

# Default command (can be overridden)
CMD ["npm", "run", "dev"]