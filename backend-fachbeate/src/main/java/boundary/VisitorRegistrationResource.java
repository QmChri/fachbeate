package boundary;

import entity.VisitorRegistration;
import io.quarkus.security.Authenticated;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;

@Path("visitorRegistration")
public class VisitorRegistrationResource {

    @POST
    ////@Authenticated
    @Transactional
    public Response postVisitorRegistration(VisitorRegistration visitorRegistration){
        VisitorRegistration responseVisitorRegistration = visitorRegistration.persistOrUpdate();
        if(responseVisitorRegistration == null){
            return Response.serverError().build();
        }
        return Response.ok(responseVisitorRegistration).build();
    }


    @GET
    //@Authenticated
    public Response getVisitorRegistration(){
        return Response.ok(VisitorRegistration.listAll()).build();
    }

    @GET
    @Path("/id")
    //@Authenticated
    public Response postVisitorRegistration(@QueryParam("id") Long id){
        return Response.ok(VisitorRegistration.findById(id)).build();
    }
    @GET
    @Path("/user")
    //@Authenticated
    public Response getVisitorRegistrationPerUser(@QueryParam("type") int user, @QueryParam("fullname") String fullname){
        if (user==7) {
            return getVisitorRegistration();
        }else if(user == 6) {
            return Response.ok(VisitorRegistration.find(
                    "creator = ?1 and showUser = true", fullname
            ).list()).build();
        }else if(user == 3){
            return Response.ok(VisitorRegistration.find(
                    "representative = ?1 and showUser = true",fullname
            ).list()).build();
        }
        return Response.ok().build();
    }
}
