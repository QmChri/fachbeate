package boundary;

import entity.*;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

@Path("appointment")
public class AppointmentResource {

    @Inject
    Logger log;

    @POST
    @Path("/customerRequirement")
    @Transactional
    public void postCustomerRequirement(CustomerRequirement customerRequirement){

        //Technologist technologist = Technologist.findById(customerRequirement.requestedTechnologist.id);

        for(CustomerVisit v : customerRequirement.customerVisits){
            v.id = null;
        }

        customerRequirement.persist();
    }

    @POST
    @Path("/workshop")
    @Transactional
    public void postWorkshopRequirement(WorkshopRequirement workshopRequirement){
        workshopRequirement.persist();

    }


    @GET
    public Response getAll(){
        return Response.ok(TechnologistAppointment.listAll()).build();
    }

}
