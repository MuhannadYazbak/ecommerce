# Base image with Node.js and Playwright dependencies
FROM mcr.microsoft.com/playwright:v1.54.1-jammy AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the Next.js app
RUN npm run build

# Install Playwright dependencies
RUN npx playwright install --with-deps

# Production runner image
FROM mcr.microsoft.com/playwright:v1.54.1-jammy AS runner
WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/playwright.config.ts ./playwright.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/auth*.json ./

ENV CI=true
EXPOSE 3000

RUN npm install -g dotenv-cli

CMD ["dotenv", "-e", ".env.docker", "--", "npm", "run", "start"]