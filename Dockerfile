FROM node:18

WORKDIR /usr/src/app

COPY server.js .

EXPOSE 3000

CMD ["node", "server.js"]
