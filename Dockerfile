FROM node:18-alpine

WORKDIR /app

# Copy server package files
COPY server/package*.json ./server/

# Install server dependencies
RUN cd server && npm install --only=production

# Copy server source code
COPY server/ ./server/

WORKDIR /app/server

EXPOSE 3002

CMD ["npm", "start"]