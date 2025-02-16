FROM node:20-alpine3.21

WORKDIR /app

COPY package.json package.json

COPY package-lock.json package-lock.json
RUN npm install

COPY tsconfig.json tsconfig.json
COPY tsconfig.app.json tsconfig.app.json
COPY tsconfig.node.json tsconfig.node.json
COPY vite.config.ts vite.config.ts
COPY postcss.config.mjs postcss.config.mjs
COPY .prettierrc .prettierrc
COPY index.html index.html
COPY public public
COPY src src

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]