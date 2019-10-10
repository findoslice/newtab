FROM node:8

WORKDIR /usr/src/tulip

COPY package*.json ./

RUN npm i

COPY . . 

EXPOSE 7500

CMD ["node", "api/api.js"]

