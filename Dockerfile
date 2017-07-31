FROM node:7.10.0

WORKDIR /usr/src/app
COPY . .
RUN npm install .

ENTRYPOINT ["./run"]
