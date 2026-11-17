FROM node:25-alpine
WORKDIR /server
RUN adduser --disabled-password dev
COPY package.json package-lock.json ./
RUN npm install
COPY --chown=dev:dev . .
RUN mkdir -p /server/uploads && chown -R dev:dev /server/uploads
USER dev

EXPOSE 3000

CMD ["npm", "start"]
