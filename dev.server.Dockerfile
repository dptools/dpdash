FROM node:16

COPY . /src

WORKDIR /src

RUN npm install

CMD [ "npm", "run", "dev" ]

EXPOSE 8000 35729

