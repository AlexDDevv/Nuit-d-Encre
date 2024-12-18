FROM node:20-alpine3.21

WORKDIR /app

COPY package.json package.json

COPY package-lock.json package-lock.json
RUN npm install

COPY tsconfig.json tsconfig.json
COPY src src

EXPOSE 5000

CMD ["npm", "start"]