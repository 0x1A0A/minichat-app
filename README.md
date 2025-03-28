# Micro Frontend realtime chat application

This is personal project for learning web development and micro frontend using vue,rsbuild and module federation. as for backend server I planning to use microsevice as well, probably using actix web.

This app no need to login just use username and roomname to load message and send message,
and also you can switch to other room that has been added to the app.

## How to run mfe compose

first we need image base-mfe-vue:rsbuild to speed up build/install time.
docker file and package.json are provided in mfe/base

go there and run

```
docker build . -t base-mfe-vue:rsbuild
```

then go to deploy/container folder.

run in dev mode.

```
docker compose -f docker-compose.local.yaml up -d --build
```

run in prod mode (build and serve using nginx).

```
docker compose up -d --build
```
