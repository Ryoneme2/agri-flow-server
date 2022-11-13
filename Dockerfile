FROM node:18

RUN mkdir -p /usr/app/server

WORKDIR /usr/app/server

COPY . .

RUN yarn && yarn build

EXPOSE 6969

CMD [ "yarn", "start" ]