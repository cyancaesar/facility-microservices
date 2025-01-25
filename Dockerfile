FROM node:22.13.1-slim

ARG APP_NAME

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build -- ${APP_NAME}

CMD [ "node", "dist/apps/${APP_NAME}/main.js" ]