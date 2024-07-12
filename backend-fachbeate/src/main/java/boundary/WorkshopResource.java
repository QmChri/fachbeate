package boundary;

import entity.VisitorRegistration;
import entity.WorkshopRequirement;
import entity.dto.MainListDTO;
import io.quarkus.security.Authenticated;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;

import java.util.ArrayList;
import java.util.List;

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
        List<WorkshopRequirement> mapList = new ArrayList<>();

        if (user==7) {
            mapList = WorkshopRequirement.listAll();
        }else if(user == 4) {
            mapList = WorkshopRequirement.find(
                    "select work from WorkshopRequirement work join work.requestedTechnologist tech " +
                            "where tech.email = ?1 and showUser = true",fullname
            ).list();
        }else if(user == 6) {
            mapList = WorkshopRequirement.find(
                    "company.username = ?1 and showUser = true",
                    fullname
            ).list();
        }else if(user == 3){
            mapList = WorkshopRequirement.find(
                    "representative.email = ?1 and showUser = true",fullname
            ).list();
        }else if(user == 8){
            mapList = WorkshopRequirement.find(
                    "select work from WorkshopRequirement work join work.requestedTechnologist tech " +
                            "where tech.email = ?1 or work.representative.email = ?1 and work.showUser = true",fullname
            ).list();
        }
        return Response.ok(
                mapList.stream().map(workshopRequirement -> new MainListDTO().mapWorkshopToMainListDTO(workshopRequirement)).toList()
        ).build();
    }
}
