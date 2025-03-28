# Micro Frontend realtime chat application

This is personal project for learning web development and micro frontend using vue,rsbuild and module federation. as for backend server I planning to use microsevice as well, probably using actix web.

This app no need to login just use username and roomname to load message and send message,
and also you can switch to other room that has been added to the app.

## How to run mfe compose

go to mfe folder.

run in dev mode.

```
docker compose -f docker-compose.local.yaml up -d --build
```

run in prod mode (build and serve using nginx).

```
docker compose up -d --build
```
