# Use Node.js
FROM node:20-bullseye-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including devDependencies (for nodemon)
RUN npm install

# Copy all source code
COPY . .

# Install nodemon globally (optional, dev convenience)
RUN npm install -g nodemon

# Use nodemon for hot reload
CMD ["nodemon"]