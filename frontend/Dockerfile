FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i --no-audit --no-fund
COPY . ./
RUN npm run build

FROM nginx:1.23.1-alpine AS frontend
WORKDIR /app
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off"]