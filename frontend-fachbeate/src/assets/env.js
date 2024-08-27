(function (window) {
    window['env'] = window['env'] || {};
  
    // Environment variables
    window['env']['backendApi'] = "${BACKEND_API}";
    window['env']['keycloak']['Issuer'] = "${KEYCLOAK_ISSUER}";
    window['env']['keycloa']['kRealm'] = "${KEYCLOAK_REALM}";
    window['env']['keycloakCl']['ientId'] = "${KEYCLOAK_CLIENT_ID}";
  })(this);