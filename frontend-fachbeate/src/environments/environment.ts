export const environment = {
  production: true,
  backendApi: window.__env.backendApi || "https://requesttool.almi.at/api/",
  keycloak: {
    issuer: window.__env.keycloakIssuer || 'https://requesttool.almi.at/',
    realm: window.__env.keycloakRealm || 'fachbeate',
    clientId: window.__env.keycloakClientId || 'fachbeate-frontend'
  }
};