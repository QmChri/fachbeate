package boundary;

import control.MailService;
import control.MailUserService;
import entity.Representative;
import entity.WorkshopRequirement;
import entity.dto.MainListDTO;
import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
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

    @Inject
    MailService mailController;
    MailUserService mailUserService;

    /**
     * Post a new Seminar Anmeldung
     * @param workshopRequirement: Entity to persist
     * @return persisted Entity
     */
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

    /**
     * List all Seminaranmeldungen
     * @return
     */
    @GET
    @Authenticated
    public Response getWorkshopRequirement(){
        return Response.ok(WorkshopRequirement.listAll()).build();
    }

    /**
     * Get Seminaranmeldungen by id
     * @return
     */
    @GET
    @Path("/id")
    @Authenticated
    public Response getWorkshopPerId(@QueryParam("id") Long id){
        return Response.ok(WorkshopRequirement.findById(id)).build();
    }

    /**
     * Returns all Seminaranmeldungen that a specific user is allowed to see
     * @param user: Roles from the user which is currently logged in
     * @param fullname: Name from the user which is currently logged in
     * @return
     */
    @GET
    @Path("/user")
    @Authenticated
    public Response getWorkshopPerUser(@QueryParam("type") int user, @QueryParam("fullname") List<String> fullname){
        List<WorkshopRequirement> mapList = new ArrayList<>();

        if (user==7) {
            mapList = WorkshopRequirement.listAll();
        }else if(user == 4) {
            mapList = WorkshopRequirement.find(
                    "select work from WorkshopRequirement work join work.requestedTechnologist tech " +
                            "where (tech.email = ?1 or creator = ?2) and showUser = true",fullname.get(1) ,fullname.get(0)
            ).list();
        }else if(user == 6) {
            mapList = WorkshopRequirement.find(
                    "(company.username = ?1 or creator = ?1) and showUser = true",fullname.get(0)
            ).list();
        }else if(user == 3){
            Representative representative = Representative.find("email", fullname.get(1)).firstResult();

            mapList = WorkshopRequirement.find("SELECT w FROM WorkshopRequirement w JOIN w.requestedTechnologist tech WHERE (w.representative.email = ?1 or w.creator = ?2 or w.representative.email in ?3 or tech.email in ?4) and w.showUser = true",
                    fullname.get(1),
                    fullname.get(0),
                    representative.groupMembersRepresentatives.stream().map(rep->rep.email).toList(),
                    representative.groupMembersTechnologists.stream().map(rep->rep.email).toList()
            ).list();
        }else if(user == 8){
            mapList = WorkshopRequirement.find(
                    "select work from WorkshopRequirement work join work.requestedTechnologist tech " +
                            "where (tech.email = ?1 or work.representative.email = ?1 or creator = ?2) and work.showUser = true",fullname.get(1) ,fullname.get(0)
            ).list();
        }
        return Response.ok(
                mapList.stream().map(workshopRequirement -> new MainListDTO().mapWorkshopToMainListDTO(workshopRequirement)).toList()
        ).build();
    }
}
