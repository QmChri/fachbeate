(function (window) {
    window['env'] = window['env'] || {};
  
    // Environment variables
    window['env']['backendApi'] = "${API_URL}";
    window['env']['keycloakIssuer'] = "${KEYCLOAK_ISSUER}";
    window['env']['keycloakRealm'] = "${KEYCLOAK_REALM}";
    window['env']['keycloakClientId'] = "${KEYCLOAK_CLIENT_ID}";
  })(this);