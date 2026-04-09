FROM node:20-alpine

WORKDIR /app

COPY Backend/package.json Backend/package-lock.json* ./
RUN npm ci --omit=dev

COPY Backend/src ./src

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "src/index.js"]

