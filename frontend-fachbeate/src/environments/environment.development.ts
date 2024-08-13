export const environment = {
  production: false,
  backendApi: "http://localhost:8079/",
  //backendApi: "http://angular02.almi.at:8080/",
  keycloak: {
    issuer: 'https://requesttool.almi.at/',
    realm: 'fachbeate',
    clientId: 'fachbeate-frontend-dev'
  }
};
