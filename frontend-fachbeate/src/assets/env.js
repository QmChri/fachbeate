(function (window) {
    window.__env = window.__env || {};
  
    // Environment variables
    window.__env.backendApi = "${BACKEND_API}";
    window.__env.keycloakIssuer = "${KEYCLOAK_ISSUER}";
    window.__env.keycloakRealm = "${KEYCLOAK_REALM}";
    window.__env.keycloakClientId = "${KEYCLOAK_CLIENT_ID}";
  })(this);