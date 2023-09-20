FROM node:18

COPY . /src

WORKDIR /src

RUN npm install --legacy-peer-deps

ENV NODE_OPTIONS=--openssl-legacy-provider

RUN npm run build
RUN npm run transpile

ENV NODE_ENV=production
CMD [ "node", "dist/bin/www.js" ]

EXPOSE 8000

