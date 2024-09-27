package boundary;

import entity.Representative;
import entity.VisitorRegistration;
import entity.dto.MainListDTO;
import io.quarkus.security.Authenticated;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Path("visitorRegistration")
public class VisitorRegistrationResource {

    final Date FIVE_DAYS_AGO = Date.from(LocalDate.now().minusDays(5).atStartOfDay(ZoneId.systemDefault()).toInstant());

    /**
     * Post a new Besucheranmeldung
     * @param visitorRegistration: Entity to persist
     * @return persisted Entity
     */
    @POST
    @Authenticated
    @Transactional
    public Response postVisitorRegistration(VisitorRegistration visitorRegistration){
        VisitorRegistration responseVisitorRegistration = visitorRegistration.persistOrUpdate();
        if(responseVisitorRegistration == null){
            return Response.serverError().build();
        }
        return Response.ok(responseVisitorRegistration).build();
    }

    /**
     * List all Besucheranmeldungen
     * @return
     */
    @GET
    @Authenticated
    public Response getVisitorRegistration(){
        return Response.ok(VisitorRegistration.listAll()).build();
    }

    /**
     * Get Besucheranmeldungen by id
     * @return
     */
    @GET
    @Path("/id")
    @Authenticated
    public Response postVisitorRegistration(@QueryParam("id") Long id){
        return Response.ok(VisitorRegistration.findById(id)).build();
    }

    /**
     * Returns all Besucheranmeldungen that a specific user is allowed to see
     * @param user: Roles from the user which is currently logged in
     * @param fullname: Name from the user which is currently logged in
     * @return
     */
    @GET
    @Path("/user")
    @Authenticated
    public Response getVisitorRegistrationPerUser(@QueryParam("type") int user, @QueryParam("fullname") List<String> fullname){
        List<VisitorRegistration> mapList = new ArrayList<>();
        if (user==7) {
            mapList = VisitorRegistration.listAll();
        }else if(user == 6) {
            mapList = VisitorRegistration.find(
                    "creator = ?1 and showUser = true", fullname.get(0)
            ).list();
        }else if(user == 3 || user == 8){
            Representative representative = Representative.find("email", fullname.get(1)).firstResult();

            mapList = VisitorRegistration.listAll();

            mapList = mapList.stream().filter(element -> {
                if(element.representative != null){
                    return element.representative.email.equals(fullname.get(1)) || representative.groupMembersRepresentatives.stream().anyMatch(rep -> Objects.equals(rep.email, element.representative.email));
                }
                if(element.creator != null) {
                    return element.creator.equals(fullname.get(0));
                }
                return false;
            }).toList();
        }
        return Response.ok(
                mapList.stream().filter(element -> getEndDate(element).after(FIVE_DAYS_AGO)).map(visit -> new MainListDTO().mapVisitToMainListDTO(visit)).toList()
        ).build();
    }


    private Date getEndDate(VisitorRegistration visitorRegistration){
        return  (visitorRegistration.toDate!=null)?visitorRegistration.toDate:(visitorRegistration.stayToDate!=null)?visitorRegistration.stayToDate:Date.from(LocalDate.now().minusDays(4).atStartOfDay(ZoneId.systemDefault()).toInstant());
    }
}
