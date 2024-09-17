package boundary;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.keycloak.representations.account.UserRepresentation;

import java.util.List;

//@RegisterRestClient(configKey = "keycloak")
@Path("/admin/realms/fachbeate/users")
public interface KeycloakResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    List<UserRepresentation> getUsers();

    @GET
    @Path("/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    UserRepresentation getUserById(@PathParam("username") String userName);
}

