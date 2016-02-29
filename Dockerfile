FROM node:5
MAINTAINER progre <djyayutto@gmail.com>
COPY package.json .
RUN npm install --production
COPY lib .
CMD ["node", "."]
