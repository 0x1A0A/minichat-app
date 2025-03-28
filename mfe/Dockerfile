FROM node:20-alpine as BASE

WORKDIR /app

ARG ARG_MFE_SERVER
ENV MFE_SERVER=${ARG_MFE_SERVER}

COPY . .
RUN rm -rf ./node_modules
RUN npm install -g pnpm && pnpm i && pnpm build


FROM nginx:stable-alpine
ENV TZ="Asia/Bangkok"

RUN apk update && apk add --no-cache tzdata
COPY --from=BASE /app/dist/ /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
