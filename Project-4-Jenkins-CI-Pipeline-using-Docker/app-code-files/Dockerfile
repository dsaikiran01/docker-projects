# Use a lightweight Node image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose your application port (change if needed)
EXPOSE 50000

# Start the application
CMD ["node", "app.js"]
