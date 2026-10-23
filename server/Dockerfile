FROM node:25-alpine AS builder
WORKDIR /server
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

FROM node:25-alpine AS runner
WORKDIR /server
ENV NODE_ENV=production
RUN adduser --disabled-password dev
COPY --from=builder --chown=dev:dev /server/. ./
RUN mkdir -p /server/uploads && chown -R dev:dev /server/uploads
USER dev

EXPOSE 3000

CMD ["npm", "start"]