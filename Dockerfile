FROM node:16

RUN mkdir -p /server/reviewsAPI

WORKDIR /server/reviewsAPI

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "server"]