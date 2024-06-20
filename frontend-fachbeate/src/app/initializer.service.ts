import { KeycloakService } from 'keycloak-angular';
import {environment} from "../environments/environment";

export function initializer(keycloak: KeycloakService): () => Promise<any> {
  return (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        await keycloak.init({
          config: {
            url: environment.keycloak.issuer,
            realm: environment.keycloak.realm,
            clientId: environment.keycloak.clientId,
          },
          loadUserProfileAtStartUp: true,
          initOptions: {
            onLoad: 'login-required',
            silentCheckSsoRedirectUri:
              window.location.origin + '/assets/silent-check-sso.html'
          },
          bearerExcludedUrls: []
        });
        resolve(null);
      } catch(error) {
        reject(error);
      }
    });
  };
}
