FROM node:16

COPY . /src

WORKDIR /src

RUN npm install --legacy-peer-deps

CMD [ "npm", "run", "dev" ]

EXPOSE 8000

