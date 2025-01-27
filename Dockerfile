# Use the official Node.js image as the base
FROM node:22

RUN npm install -g pnpm

# Install Puppeteer dependencies and Chrome
RUN apt-get update && apt-get install -y \
  wget \
  curl \
  gnupg \
  libnss3 \
  libxss1 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libgbm1 \
  libasound2 \
  libpangocairo-1.0-0 \
  libx11-xcb1 \
  fonts-liberation \
  xdg-utils \
  --no-install-recommends && \
  wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list' && \
  apt-get update && apt-get install -y google-chrome-stable && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /usr/src/app


# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Manually install Chromium
RUN npx puppeteer browsers install chrome

# Copy the rest of the application code
COPY . .

# Expose the application's port
EXPOSE 3000

# Command to run the application
CMD ["pnpm", "run" , "start"]
