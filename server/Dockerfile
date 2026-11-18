FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

RUN adduser -D appuser && \
    chown -R appuser:appuser /app
USER appuser

EXPOSE 5000

CMD ["node", "dist/main.js"]
