#!/bin/sh

# Replace variables in JavaScript files
for file in /usr/share/nginx/html/*.js; do
  envsubst '$BACKEND_API $KEYCLOAK_ISSUER $KEYCLOAK_REALM $KEYCLOAK_CLIENT_ID' < $file > $file
done

exec "$@"