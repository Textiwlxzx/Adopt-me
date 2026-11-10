FROM node:24-alpine3.24 AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:24-alpine3.24 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

COPY --from=base /app/node_modules ./node_modules
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
