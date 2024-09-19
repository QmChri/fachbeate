package control;

import entity.MailUser;
import entity.enums.Function;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.idm.GroupRepresentation;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class KeycloakService {

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

    public List<MailUser> getAllUsers() {
        List<MailUser> users = keycloak.realm("fachbeate")
                .users()
                .list().stream().map(element -> new MailUser(element.getId(),
                        element.getFirstName(), element.getLastName(),
                        element.getUsername(), element.getEmail(), Function.LEER,element.isEnabled())).toList();
        return users;
    }

    public List<GroupRepresentation> getAllGroups() {
        return keycloak.realm("fachbeate").groups().groups();
    }

    public List<MailUser> getUsersInGroup(String groupId) {
        return keycloak.realm("fachbeate").groups().group(groupId).members()
                .stream().map(element -> new MailUser(
                element.getId(),
                element.getFirstName(), element.getLastName(),
                element.getUsername(), element.getEmail(), Function.LEER,element.isEnabled())).toList();
    }


    public Map<String, List<MailUser>> getGroupsWithUsers() {
        Map<String, List<MailUser>> groupsWithUsers = new HashMap<>();

        // Alle Gruppen abrufen
        List<GroupRepresentation> groups = getAllGroups();

        // Für jede Gruppe die Mitglieder (Benutzer) abrufen
        for (GroupRepresentation group : groups) {
            String groupId = group.getId();
            List<MailUser> usersInGroup = getUsersInGroup(groupId);
            groupsWithUsers.put(group.getName(), usersInGroup);  // Gruppenname als Schlüssel, Benutzerliste als Wert
            for (MailUser user : usersInGroup) {
                user.function = Function.getFunction(group.getName());
            }
        }
        return groupsWithUsers;
    }

}
