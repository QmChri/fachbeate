export const environment = {
  production: true,
    // @ts-ignore
  backendApi: window['env']['backendBaseUrl'] || "https://requesttool.almi.at/api/",
  keycloak: {
      // @ts-ignore
    issuer: window['env']['keycloakIssuer'] || 'https://requesttool.almi.at/',
      // @ts-ignore
    realm: window['env']['keycloakRealm'] || 'fachbeate',
      // @ts-ignore
    clientId: window['env']['keycloakClientId'] || 'fachbeate-frontend'
  }
};