# Stage 1: Build Angular App
FROM node:18 as node
WORKDIR /app
COPY ./package*.json /app/
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Serve Angular App with Nginx
FROM nginx:alpine
COPY --from=node /app/dist/frontend-fachbeate/browser /usr/share/nginx/html
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set the entrypoint to the script that replaces env variables
ENTRYPOINT ["/entrypoint.sh"]