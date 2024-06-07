FROM node:13

WORKDIR /app

COPY package*. ./

RUN npm install 

COPY . . 

ENV PORT=4000

EXPOSE 4000

CMD ["npm" , "start"]