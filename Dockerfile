FROM node:5
MAINTAINER progre <djyayutto@gmail.com>
WORKDIR /app
COPY package.json package.json
RUN npm install --production
COPY lib lib
CMD ["node", "."]
EXPOSE 3000 3001
