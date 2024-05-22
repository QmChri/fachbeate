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
    @Transactional
    public Response postCustomerRequirement(CustomerRequirement customerRequirement){

        //Technologist technologist = Technologist.findById(customerRequirement.requestedTechnologist.id);

        if(customerRequirement.id == null || customerRequirement.id == 0) {
            customerRequirement.persist();

            for (CustomerVisit v : customerRequirement.customerVisits) {
                v.persist();
                if(v.finalReport != null) {
                    v.finalReport.id = null;
                    v.finalReport.persist();
                }
            }

            return Response.ok(customerRequirement).build();
        }

        CustomerRequirement persistedCR = CustomerRequirement.findById(customerRequirement.id);
        persistedCR.updateEntity(customerRequirement);
        return Response.ok(persistedCR).build();
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
