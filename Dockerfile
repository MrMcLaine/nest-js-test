# Use an official lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /opt/app

# Create a non-root user
RUN adduser -S app

# Copy package.json and package-lock.json before copying the rest of the files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy all remaining project files
COPY . .

# Change ownership to the non-root user
RUN chown -R app /opt/app

# Switch to the non-root user
USER app

# Expose application port
EXPOSE 5000

# Run the application
CMD ["npm", "run", "start:prod"]
