FROM node:22-slim

RUN apt update

USER node

WORKDIR /app/node

EXPOSE 3000

CMD yarn && yarn dev