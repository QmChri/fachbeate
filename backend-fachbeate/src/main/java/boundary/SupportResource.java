package boundary;

import entity.Support;
import io.quarkus.security.Authenticated;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

@Path("support")
public class SupportResource {

    @POST
    @Transactional
    @Authenticated
    public Response postSupport(Support support){
        support.persistOrUpdate();
        return Response.ok(support).build();
    }
}
