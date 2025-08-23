# Base image with Node.js and Playwright dependencies
FROM mcr.microsoft.com/playwright:v1.54.1-jammy 

# Set working directory
WORKDIR /app

# Set arguments
# ARG RESEND_API_KEY
# ARG DB_PASSWORD
# ARG LOCATIONIQ_KEY
# ARG JWT_SECRET
# ENV RESEND_API_KEY=$RESEND_API_KEY
# ENV DB_PASSWORD=$DB_PASSWORD
# ENV LOCATIONIQ_KEY=$LOCATIONIQ_KEY
# ENV JWT_SECRET=$JWT_SECRET


# Copy package files and install dependencies
COPY .env.docker .env.docker
COPY package*.json ./
COPY playwright.config.ts ./
COPY public/ ./public/
COPY src/ ./src/
COPY .next/ .next/
COPY tsconfig.json ./tsconfig.json
COPY auth.json ./auth.json
COPY auth.admin.json ./auth.admin.json
RUN npm install
RUN npx playwright install --with-deps
ENV CI=true

# Expose dev server port
EXPOSE 3000

RUN npm install -g dotenv-cli
CMD ["dotenv", "-e", ".env.docker", "--", "npm", "run", "start"]

# # Default command (can be overridden)
# CMD ["npm", "run", "dev"]