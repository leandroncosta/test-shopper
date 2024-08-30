FROM node:20.17.0

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

# RUN npx prisma generate

EXPOSE 3333 

# RUN npx prisma migrate dev

# RUN npx prisma studio

CMD ["sh", "-c", "npx prisma migrate dev && npm run start"]

