export const environment = {
  production: false,
  backendApi: "http://localhost:8079/",
  //backendApi: "https://requesttool.almi.at/api",
  keycloak: {
    issuer: 'https://requesttool.almi.at/',
    realm: 'fachbeate',
    clientId: 'fachbeate-frontend-dev'
  }
};
