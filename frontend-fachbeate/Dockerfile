# Stage 1: Build Angular App
FROM node:18 as node
WORKDIR /app
COPY ./package*.json /app/
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Serve Angular App with Nginx
FROM nginx:alpine
COPY --from=node /app/dist/frontend-fachbeate /usr/share/nginx/html
RUN ls -l /usr/share/nginx/html
RUN cat /usr/share/nginx/html/index.html
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf
