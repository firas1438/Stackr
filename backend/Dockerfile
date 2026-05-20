# 00_build stage
FROM node:20-alpine AS builder

WORKDIR /app

# install deps and generate prisma client
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
RUN npx prisma generate

# copy source and build
COPY . .
RUN npm run build


# 01_production stage
FROM node:20-alpine

WORKDIR /app

# install production deps only
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# copy built output and prisma client from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# drop to non-root user
USER node

EXPOSE 3000

CMD ["node", "dist/src/main.js"]