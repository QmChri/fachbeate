package boundary;

import control.MailUserService;
import entity.MailUser;
import io.quarkus.mailer.Mail;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.idm.UserRepresentation;
import org.keycloak.representations.idm.GroupRepresentation;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/keycloak")
public class KeycloakResource {

    Keycloak keycloak;

    @PostConstruct
    public void initKeycloak() {
        keycloak = KeycloakBuilder.builder()
                .serverUrl("http://angular02.almi.at:8080")
                .realm("master")
                .clientId("admin-cli")
                .clientSecret("uRu2GpyX8emJkVFilyuVwoFu7KsWwDUc")
                .grantType("password")
                .username("admin")
                .password("ctD+-l17J8J0")
                .build();
    }

    @PreDestroy
    public void closeKeycloak(){
        keycloak.close();
    }

    @GET
    @Path("/users")
    public Response getAllUsers() {
        List<MailUser> users = keycloak.realm("fachbeate")
                .users()
                .list().stream().map(element -> new MailUser(
                        element.getFirstName(), element.getLastName(),
                        element.getUsername(), element.getEmail(),element.isEnabled())).toList();
        return Response.ok(users).build();
    }

    public List<GroupRepresentation> getAllGroups() {
        return keycloak.realm("fachbeate").groups().groups();
    }

    public List<UserRepresentation> getUsersInGroup(String groupId) {
        return keycloak.realm("fachbeate").groups().group(groupId).members();
    }

    @Path("/groupsAndUsers")
    @GET
    public Map<String, List<UserRepresentation>> getGroupsWithUsers() {
        Map<String, List<UserRepresentation>> groupsWithUsers = new HashMap<>();

        // Alle Gruppen abrufen
        List<GroupRepresentation> groups = getAllGroups();

        // Für jede Gruppe die Mitglieder (Benutzer) abrufen
        for (GroupRepresentation group : groups) {
            String groupId = group.getId();
            List<UserRepresentation> usersInGroup = getUsersInGroup(groupId);
            groupsWithUsers.put(group.getName(), usersInGroup);  // Gruppenname als Schlüssel, Benutzerliste als Wert
        }

        return groupsWithUsers;
    }
}
