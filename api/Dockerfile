FROM node:12-alpine

WORKDIR /home/node/app

COPY package.json package-lock.json ./

RUN apk add --no-cache --virtual .gyp python make g++ \
    && npm install --production \
    && npm run build \
    && apk del .gyp \
    && chown -R node:node .

COPY --chown=node:node . .

EXPOSE 8443

USER node

CMD [ "node", "dist/server.js" ]
