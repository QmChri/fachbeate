package boundary;

import entity.WorkshopRequirement;
import io.quarkus.security.Authenticated;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;

@Path("/workshop")
public class WorkshopResource {


    @POST
    @Authenticated
    @Transactional
    public Response postWorkshopRequirement(WorkshopRequirement workshopRequirement){
        WorkshopRequirement responseWorkshopRequirement = workshopRequirement.persistOrUpdate();
        if(responseWorkshopRequirement == null){
            return Response.serverError().build();
        }
        return Response.ok(responseWorkshopRequirement).build();
    }

    @GET
    @Authenticated
    public Response getWorkshopRequirement(){
        return Response.ok(WorkshopRequirement.listAll()).build();
    }

    @GET
    @Path("/id")
    @Authenticated
    public Response getWorkshopPerId(@QueryParam("id") Long id){
        return Response.ok(WorkshopRequirement.findById(id)).build();
    }

    @GET
    @Path("/user")
    @Authenticated
    public Response getWorkshopPerUser(@QueryParam("type") int user, @QueryParam("fullname") String fullname){
        if (user==7) {
            return getWorkshopRequirement();
        }else if(user == 4) {
            return Response.ok(WorkshopRequirement.find(
                    "select work from WorkshopRequirement work join work.requestedTechnologist tech " +
                            "where tech.email = ?1 and showUser = true",fullname
            ).list()).build();
        }else if(user == 6) {
            return Response.ok(WorkshopRequirement.find(
                    "company.username = ?1 and showUser = true",
                    fullname
            ).list()).build();
        }else if(user == 3){
            return Response.ok(WorkshopRequirement.find(
                    "representative.email = ?1 and showUser = true",fullname
            ).list()).build();
        }
        return Response.ok().build();
    }
}
