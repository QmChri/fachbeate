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

# Install gettext for envsubst (used to replace env vars in runtime)
RUN apk add --no-cache gettext
# Copy the env.template.js file to the assets directory
COPY src/assets/env.template.js /usr/share/nginx/html/assets/env.template.js
