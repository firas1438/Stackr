# 00_build stage
FROM node:20-alpine AS builder

WORKDIR /app

# install deps first (better caching)
COPY package*.json ./
RUN npm install

# copy source
COPY . .

# build vite app
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build


# 01_production stage
FROM nginx:alpine

# copy custom nginx configuration (allows spa routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# expose default port
EXPOSE 80

# start nginx
CMD ["nginx", "-g", "daemon off;"]