FROM node:5
MAINTAINER progre <djyayutto@gmail.com>
WORKDIR /app
COPY package.json package.json
RUN npm install --production
COPY lib lib
CMD ["node", ".", "80", "8080"]
