export const environment = {
  production: false,
  //backendApi: "http://localhost:8079/",
  backendApi: "http://localhost:8079/",
  keycloak: {
    issuer: 'https://requesttool.almi.at/',
    realm: 'fachbeate',
    clientId: 'fachbeate-frontend-dev'
  }
};
