FROM rust as builder
WORKDIR /usr/src/chat_server
COPY . .
RUN cargo install --path .

FROM debian:bookworm-slim
RUN apt-get update &&  rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/chat_server /usr/local/bin/app
CMD ["app"]

