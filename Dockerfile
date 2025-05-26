FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy all files from the Coolify checkout directory into the container
COPY . /app

# Install dependencies
RUN npm install

# Start the application
CMD ["npx", "start"]