FROM node:20-alpine

WORKDIR /app

COPY package.json .
RUN rm -rf ./node_modules
RUN npm install -g pnpm && pnpm i

