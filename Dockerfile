# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Build the application
RUN npm run build

# Port to listen on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:prod"] 