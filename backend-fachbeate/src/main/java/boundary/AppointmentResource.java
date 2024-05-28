package boundary;

import entity.*;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

@Path("appointment")
public class AppointmentResource {

    @Inject
    Logger log;

    @POST
    @Path("/customerRequirement")
    @Transactional(Transactional.TxType.REQUIRED)
    public Response postCustomerRequirement(CustomerRequirement customerRequirement){
        CustomerRequirement responseCustomerRequirement = customerRequirement.persistOrUpdate();
        if(responseCustomerRequirement == null){
            return Response.serverError().build();
        }
        responseCustomerRequirement.customerVisits.size();
        return Response.ok(responseCustomerRequirement).build();
    }
    @GET
    @Path("/customerRequirement")
    public Response getCustomerRequirement(){
        return Response.ok(CustomerRequirement.listAll()).build();
    }
     @GET
     @Path("/customerRequirement/id")
     public Response getCustomerRequirementPerId(@QueryParam("id") Long id){
        return Response.ok(CustomerRequirement.findById(id)).build();
     }


    @POST
    @Path("/workshop")
    @Transactional
    public void postWorkshopRequirement(WorkshopRequirement workshopRequirement){
        workshopRequirement.persist();
    }

    @GET
    @Path("/workshop")
    public Response getWorkshopRequirement(){
        return Response.ok(WorkshopRequirement.listAll()).build();
    }

    @GET
    @Path("/workshop")
    public Response getWorkshopPerId(@QueryParam("id") Long id){
        return Response.ok(WorkshopRequirement.findById(id)).build();
    }

}
