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

import java.util.ArrayList;
import java.util.List;

@Path("customerRequirement")
public class CustomerRequirementResource {

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
            customerRequirements = CustomerRequirement.listAll();
        }else if(user == 4) {
            customerRequirements = CustomerRequirement.find(
                    "(requestedTechnologist.email = ?1 " +
                            "or creator = ?2 or requestedTechnologist.email) and showUser = true",
                    fullname.get(1), fullname.get(0)).list();
        } else if(user == 6) {
            customerRequirements = CustomerRequirement.find(
                    "(company.username = ?1 or creator = ?1) and showUser = true",
                    fullname.get(0)
            ).list();
        } else if(user == 3){
            Representative representative = Representative.find("email", fullname.get(1)).firstResult();
            customerRequirements = CustomerRequirement.find(
                    "(representative.email = ?1 or creator = ?2 or requestedTechnologist.email in ?3 or representative.email in ?4) and showUser = true",
                    fullname.get(1),
                    fullname.get(0),
                    representative.groupMembersTechnologists.stream().map(tech->tech.email).toList(),
                    representative.groupMembersRepresentatives.stream().map(rep->rep.email).toList()
            ).list();
        }else if(user == 8){
            customerRequirements = CustomerRequirement.find(
                    "(representative.email = ?1 or requestedTechnologist.email = ?1 or creator = ?2) and showUser = true", fullname.get(1), fullname.get(0)
            ).list();
        }

        return Response.ok(customerRequirements.stream().map(req -> new MainListDTO().mapCustomerToMainListDTO(req)).toList()).build();
    }



}
