package boundary;

import entity.*;
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

@Path("customerRequirement")
public class CustomerRequirementResource {

    final Date FIVE_DAYS_AGO = Date.from(LocalDate.now().minusDays(14).atStartOfDay(ZoneId.systemDefault()).toInstant());

    /**
     * Post a new Fachberateranforderung
     * @param customerRequirement: Entity to persist
     * @return persisted Entity
     */
    @POST
    @Authenticated
    @Transactional(Transactional.TxType.REQUIRED)
    public Response postCustomerRequirement(CustomerRequirement customerRequirement){
        CustomerRequirement responseCustomerRequirement = customerRequirement.persistOrUpdate();
        if(responseCustomerRequirement == null){
            return Response.serverError().build();
        }
        return Response.ok(responseCustomerRequirement).build();
    }

    /**
     * List all Fachberater Anforderungen
     * @return
     */
    @GET
    @Authenticated
    public Response getCustomerRequirement(){
        return Response.ok(CustomerRequirement.listAll()).build();
    }

    /**
     * Get Fachberater Anforderungen by id
     * @return
     */
    @GET
    @Path("/id")
    @Authenticated
    public Response getCustomerRequirementPerId(@QueryParam("id") Long id){

        CustomerRequirement cr = CustomerRequirement.findById(id);
        return Response.ok(cr).build();
    }

    /**
     * Returns all Fachberater Anforderungen that a specific user is allowed to see
     * @param user: Roles from the user which is currently logged in
     * @param fullname: Name from the user which is currently logged in
     * @return
     */
    @GET
    @Path("/user")
    @Authenticated
    public Response getCustomerRequirementPerUser(@QueryParam("type") int user, @QueryParam("fullname") List<String> fullname){
        List<CustomerRequirement> customerRequirements = new ArrayList<>();


        if (user==7) {
            customerRequirements = CustomerRequirement.find("endDate >= ?1", FIVE_DAYS_AGO).list();
        }else if(user == 4) {
            customerRequirements = CustomerRequirement.find(
                    "(requestedTechnologist.email = ?1 " +
                            "or creator = ?2) and showUser = true and endDate >= ?3",
                    fullname.get(1), fullname.get(0),FIVE_DAYS_AGO).list();
        } else if(user == 6) {
            customerRequirements = CustomerRequirement.find(
                    "(company.username = ?1 or creator = ?1) and showUser = true and endDate >= ?2",
                    fullname.get(0),
                    FIVE_DAYS_AGO
            ).list();
        } else if(user == 3){
            Representative representative = Representative.find("email", fullname.get(1)).firstResult();
            customerRequirements = CustomerRequirement.find(
                    "(representative.email = ?1 or creator = ?2 or requestedTechnologist.email in ?3 or representative.email in ?4) and showUser = true and endDate >= ?5",
                    fullname.get(1),
                    fullname.get(0),
                    representative.groupMembersTechnologists.stream().map(tech->tech.email).toList(),
                    representative.groupMembersRepresentatives.stream().map(rep->rep.email).toList(),
                    FIVE_DAYS_AGO
            ).list();
        }else if(user == 8){
            customerRequirements = CustomerRequirement.find(
                    "(representative.email = ?1 or requestedTechnologist.email = ?1 or creator = ?2) and showUser = true and endDate >= ?3", fullname.get(1), fullname.get(0), FIVE_DAYS_AGO
            ).list();
        }

        return Response.ok(customerRequirements.stream().map(req -> new MainListDTO().mapCustomerToMainListDTO(req)).toList()).build();
    }



}
