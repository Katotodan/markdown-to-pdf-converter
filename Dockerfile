FROM node:22-bullseye-slim

# Install dependencies required by headless Chromium
RUN apt-get update && apt-get install -y --no-install-recommends \
	ca-certificates \
	fonts-liberation \
	libnss3 \
	libxss1 \
	libasound2 \
	libatk-bridge2.0-0 \
	libgtk-3-0 \
	libx11-xcb1 \
	libxcomposite1 \
	libxcursor1 \
	libxdamage1 \
	libxrandr2 \
	libxinerama1 \
	libgbm1 \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --production

# Copy app source
COPY . .

ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]



