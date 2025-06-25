# Etapa 1: Build
FROM node:18 AS build

WORKDIR /app

# Copie apenas os arquivos de dependências para aproveitar o cache do Docker
COPY package*.json ./
RUN npm install

# Copie o restante do código
COPY . .

# Gere os arquivos do Prisma e faça o build do projeto
RUN npx prisma generate
RUN npm run build

# Etapa 2: Runtime
FROM node:18-slim

WORKDIR /app

# Instale o OpenSSL (necessário para Prisma)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copie apenas o necessário da etapa de build
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/docs ./docs

# Instale apenas as dependências de produção
RUN npm install --production

# Garante que as migrations sejam aplicadas toda vez que o container subir
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
