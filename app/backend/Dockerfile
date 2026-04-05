FROM node:23-alpine3.21

WORKDIR /app

# Enable pnpm via corepack (built into Node.js)
RUN corepack enable pnpm

# COPY only necessary files
COPY package.json ./

# Install dependencies
RUN pnpm install

# COPY tsconfig and nodemon config
COPY tsconfig.json nodemon.json ./

# COPY the entire src directory
COPY src ./src

# Expose port
EXPOSE 3310

CMD ["pnpm", "start"]
