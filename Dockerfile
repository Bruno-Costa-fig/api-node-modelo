# Use a imagem oficial do Node.js como base
FROM node:alpine

# Defina o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante da aplicação para o diretório de trabalho
COPY . .

# Exponha a porta que a API vai rodar
EXPOSE 3000

# Comando para iniciar a API
CMD ["node", "index.js"]