package boundary;

import entity.CustomerRequirement;
import io.quarkus.security.Authenticated;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;

@Path("customerRequirement")
public class CustomerRequirementResource {


    @POST
    //@Authenticated
    @Transactional(Transactional.TxType.REQUIRED)
    public Response postCustomerRequirement(CustomerRequirement customerRequirement){
        CustomerRequirement responseCustomerRequirement = customerRequirement.persistOrUpdate();
        if(responseCustomerRequirement == null){
            return Response.serverError().build();
        }
        return Response.ok(responseCustomerRequirement).build();
    }
    @GET
    //@Authenticated
    public Response getCustomerRequirement(){
        return Response.ok(CustomerRequirement.listAll()).build();
    }

    @GET
    @Path("/id")
    //@Authenticated
    public Response getCustomerRequirementPerId(@QueryParam("id") Long id){

        CustomerRequirement cr = CustomerRequirement.findById(id);
        return Response.ok(cr).build();
    }

    @GET
    @Path("/user")
    //@Authenticated
    public Response getCustomerRequirementPerUser(@QueryParam("type") int user, @QueryParam("fullname") String fullname){
        if (user==7) {
            return getCustomerRequirement();
        }else if(user == 4) {
            return Response.ok(CustomerRequirement.find("requestedTechnologist.email = ?1 and showUser = true",
                    fullname).list()).build();
        } else if(user == 6) {
            return Response.ok(CustomerRequirement.find(
                    "company.username = ?1 and showUser = true",
                    fullname
            ).list()).build();
        } else if(user == 3){
            return Response.ok(CustomerRequirement.find(
                    "representative.email = ?1 and showUser = true",fullname
            ).list()).build();
        }
        return Response.ok().build();
    }



}
