# Use Node 20
FROM node:20-slim

# Install Chromium and dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf \
    libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set Puppeteer environment
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies
RUN npm install

# Copy source code
COPY . .

# --- DUMMY VARIABLES FOR BUILD ---
# These prevent Next.js from crashing during static generation if it can't find real keys
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db" \
    REDIS_URL="redis://localhost:6379" \
    GOOGLE_GENERATIVE_AI_API_KEY="dummy_key" \
    NEXTAUTH_SECRET="dummy_secret" \
    STRIPE_SECRET_KEY="dummy_key" \
    STRIPE_WEBHOOK_SECRET="dummy_key" \
    NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Generate Prisma client
RUN npx prisma generate

# Build the app
RUN npm run build

# Now set to production
ENV NODE_ENV=production

# Start the app
CMD ["npm", "start"]
