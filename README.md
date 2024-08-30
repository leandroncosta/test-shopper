
#   API - Teste 


 <img src="https://img.shields.io/static/v1?label=Tipo&message=API&color=f4&labelColor=000000" alt="Exercicio" />


## Tecnologias

- [Nodejs](https://nodejs.org/en)
- [Typescript](https://www.typescriptlang.org/)
- [Fastify](https://fastify.dev/)
- [Postgresql](https://www.postgresql.org/)

## Práticas adotadas

- API Rest
- Consultas com prisma ORM

## API Endpoints

```markdown
# Para realizar a leitura de uma foto de um medidor e upload

POST /upload

{
"image" : "base64",
"customer_code" : "string",
"measure_datetime" : "string" (formato: 2024-09-31T12:45:30Z),
"measure_type" : "string" (WATER ou GAS)
}


# Para retornar todas as leituras de um id específico

GET /:customer_code/list

{ }

# Para atualizar e corrigir o valor de uma leitura do medidor 

PATCH /confirm

{
"measure_uuid": "a6ee6621-8e3e-4c9c-920a-c320e5e419e5",
"confirmed_value": 200
}
```

## Como executar o projeto 🚀


### (Com Docker)  🐳



### Requisitos:

*Ter o [docker](https://www.docker.com/) instalado na sua máquina*

- Clonar repositório git
```
$ git clone https://github.com/leandroncosta/test-shopper.git
$ cd pastaDoProjeto
```

- Criar um arquivo .env semelhante ao .env.example e adicionar as variáveis necessárias

```
DATABASE_URL="postgresql://postgres:root@db:5432/shopper?schema=public"

GEMINI_API_KEY=

PORT=3333
```

- Rodar o projeto
```
$  docker compose up --build -d
```
- Acessar
```
$  http://localhost:3333
```


### (Sem Docker) 💻

##

### Requisitos:
*Ter o [Nodejs](https://nodejs.org/en/) instalado na máquina + algum banco de dados rodando (necessário de alterarações na pasta /prisma)*


- Clonar repositório git

```
$ git clone https://github.com/leandroncosta/test-shopper.git
$ cd pastaDoProjeto
```
- Construir o projeto:
```
$ npm install
```
- Criar um arquivo .env semelhante ao .env.example e adicionar as variáveis necessárias

```
DATABASE_URL=

GEMINI_API_KEY=

PORT=
```

- Prisma:
```
$ npx prisma migrate dev
```
- Executar a aplicação:
```
$ npm run start
```
- Acessar
```
$  http://localhost:3333
```

## Trechos de código

### docker-compose.yml

```yaml
version: '3.7'
services:
  db:
    image: postgres:14-alpine
    container_name: pg_db
    restart: always
    environment:
      POSTGRES_DB: shopper
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: root
    ports:
      - 5433:5432
    volumes:
      - ./.data/postgresql/data:/var/lib/postgresql/data

  app-api:
    container_name: backend
    build: .
    ports:
      - 3333:3333
    depends_on:
      - db
```
### schema.prisma

```markdown
generator client {
  provider = "prisma-client-js"
}

  datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

  enum MeasureType {
  WATER
  GAS
}

  model Measure {
  measure_uuid     String      @id @default(uuid())
  image_url        String
  customer_code    String
  measure_datetime DateTime
  measure_type     MeasureType
  has_confirmed    Boolean?
  measure_value    Int

  @@map("measures")
}
```



