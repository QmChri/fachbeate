export const environment = {
  production: false,
  backendApi: "http://10.2.2.252:8079/",
  //backendApi: "http://angular02.almi.at:8080/",

  keycloak: {
    issuer: 'http://keycloak01.almi.at:8080/',
    realm: 'fachbeate',
    clientId: 'fachbeate-frontend-dev'
  }
};
