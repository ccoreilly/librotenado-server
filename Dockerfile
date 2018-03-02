FROM node:carbon-alpine

RUN apk add --no-cache --update alpine-sdk python
RUN mkdir -p /srv/librotenado
WORKDIR /srv/librotenado

# Install app dependencies
COPY package*.json /srv/librotenado/
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]