export const environment = {
  production: false,
  backendApi: "http://localhost:8079/",
  keycloak: {
    issuer: 'http://keycloak01.almi.at:8080/',
    realm: 'fachbeate',
    clientId: 'fachbeate-frontend-dev'
  }
};
