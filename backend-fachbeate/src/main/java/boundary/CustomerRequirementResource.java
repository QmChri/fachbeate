package boundary;

import entity.CustomerRequirement;
import entity.TechnologistAppointment;
import entity.WorkshopRequirement;
import jakarta.persistence.Transient;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

import java.time.LocalDate;

@Path("customerRequirement")
public class CustomerRequirementResource {


    @POST
    @Path("/customerRequirement")
    @Transactional
    public void postCustomerRequirement(CustomerRequirement customerRequirement){

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
