package control;

import boundary.KeycloakResource;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.keycloak.representations.account.UserRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@ApplicationScoped
public class KeycloakService {

    private static final Logger log = LoggerFactory.getLogger(KeycloakService.class);
    @ConfigProperty(name = "keycloak.auth-server-url")
    String keycloakServerUrl;

    @ConfigProperty(name = "keycloak.client-id")
    String clientId;

    @ConfigProperty(name = "keycloak.client-secret")
    String clientSecret;

    @Inject
    @RestClient
    KeycloakResource keycloakAdminClient;

    public List<UserRepresentation> getAllUsers() {
        return keycloakAdminClient.getUsers();
    }
}

