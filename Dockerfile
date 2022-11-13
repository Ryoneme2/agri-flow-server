FROM node:18

RUN mkdir /usr/app/server

WORKDIR /usr/app/server

COPY . .

RUN yarn && yarn build

CMD [ "yarn", "start" ]