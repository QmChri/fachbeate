package boundary;

import entity.*;
import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import org.hibernate.jdbc.Work;
import org.jboss.logging.Logger;

@Path("appointment")
public class AppointmentResource {

    @Inject
    Logger log;

    @POST
    @Path("/customerRequirement")
    @Authenticated
    @Transactional(Transactional.TxType.REQUIRED)
    public Response postCustomerRequirement(CustomerRequirement customerRequirement){
        CustomerRequirement responseCustomerRequirement = customerRequirement.persistOrUpdate();
        if(responseCustomerRequirement == null){
            return Response.serverError().build();
        }
        return Response.ok(responseCustomerRequirement).build();
    }
    @GET
    @Path("/customerRequirement")
    @Authenticated
    public Response getCustomerRequirement(){
        return Response.ok(CustomerRequirement.listAll()).build();
    }

     @GET
     @Path("/customerRequirement/id")
     @Authenticated
     public Response getCustomerRequirementPerId(@QueryParam("id") Long id){
        return Response.ok(CustomerRequirement.findById(id)).build();
     }

    @GET
    @Path("/customerRequirement/user")
    @Authenticated
    public Response getCustomerRequirementPerUser(@QueryParam("type") int user, @QueryParam("fullname") String fullname){
        if (user==7) {
            return getCustomerRequirement();
        }else if(user == 4) {
            return Response.ok(CustomerRequirement.find("requestedTechnologist.firstName = ?1 and requestedTechnologist.lastName = ?2", fullname.split(";")[0], fullname.split(";")[1]).list()).build();
        }else if(user == 6) {
            return Response.ok(CustomerRequirement.find("creator", fullname).list()).build();
        }else if(user == 3){
            return Response.ok(CustomerRequirement.find("representative.firstName = ?1 and representative.lastName", fullname.split(";")[0], fullname.split(";")[1]).list()).build();
        }
        return Response.ok().build();
    }


    @POST
    @Path("/workshop")
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
    @Path("/workshop")
    @Authenticated
    public Response getWorkshopRequirement(){
        return Response.ok(WorkshopRequirement.listAll()).build();
    }

    @GET
    @Path("/workshop/id")
    @Authenticated
    public Response getWorkshopPerId(@QueryParam("id") Long id){
        return Response.ok(WorkshopRequirement.findById(id)).build();
    }

    @GET
    @Path("/workshop/user")
    @Authenticated
    public Response getWorkshopPerUser(@QueryParam("type") int user, @QueryParam("fullname") String fullname){
        if (user==7) {
            return getWorkshopRequirement();
        }else if(user == 4) {
            return Response.ok(WorkshopRequirement.find("select work from WorkshopRequirement work join work.requestedTechnologist tech " +
                    "where tech.firstName = ?1 and tech.lastName = ?2", fullname.split(";")[0], fullname.split(";")[1]).list()).build();
        }else if(user == 6) {
            return Response.ok(WorkshopRequirement.find("creator", fullname).list()).build();
        }else if(user == 3){
            return Response.ok(WorkshopRequirement.find("representative.firstName = ?1 and representative.lastName", fullname.split(";")[0], fullname.split(";")[1]).list()).build();
        }
        return Response.ok().build();
    }
    @POST
    @Path("/visitorRegistration")
    @Authenticated
    @Transactional
    public Response postVisitorRegistration(VisitorRegistration visitorRegistration){
        VisitorRegistration responseVisitorRegistration = visitorRegistration.persistOrUpdate();
        if(responseVisitorRegistration == null){
            return Response.serverError().build();
        }
        return Response.ok(responseVisitorRegistration).build();
    }


    @GET
    @Path("/visitorRegistration")
    @Authenticated
    public Response getVisitorRegistration(){
        return Response.ok(VisitorRegistration.listAll()).build();
    }

    @GET
    @Path("/visitorRegistration/id")
    @Authenticated
    public Response postVisitorRegistration(@QueryParam("id") Long id){
        return Response.ok(VisitorRegistration.findById(id)).build();
    }
    @GET
    @Path("/visitorRegistration/user")
    @Authenticated
    public Response getVisitorRegistrationPerUser(@QueryParam("type") int user, @QueryParam("fullname") String fullname){
        System.out.println("user"+ user + "fullname" + fullname);

        if (user==7) {
            return getVisitorRegistration();
        }else if(user == 6) {
            return Response.ok(VisitorRegistration.find("creator", fullname).list()).build();
        }else if(user == 3){
            return Response.ok(VisitorRegistration.find("representative.firstName = ?1 and representative.lastName", fullname.split(";")[0], fullname.split(";")[1]).list()).build();
        }
        return Response.ok().build();
    }


    @POST
    @Path("/other")
    @Transactional
    @Authenticated
    public Response postOtherAppointment(TechnologistAppointment technologistAppointment){
        if(technologistAppointment.id != null && technologistAppointment.id != 0) {
            TechnologistAppointment persisted = TechnologistAppointment.findById(technologistAppointment.id);
            persisted.updateEntity(technologistAppointment);
            return Response.ok(persisted).build();
        }
        technologistAppointment.persist();

        return Response.ok(technologistAppointment).build();
    }

    @GET
    @Path("/other")
    @Authenticated
    public Response getOtherAppointments(){
        return Response.ok(TechnologistAppointment.listAll().stream().filter(
                element -> !(element instanceof WorkshopRequirement) && !(element instanceof CustomerRequirement)
        )).build();
    }

    @GET
    @Path("/other/id")
    @Authenticated
    public Response getOtherAppointmentPerId(@QueryParam("id") Long id){
        return Response.ok(TechnologistAppointment.findById(id)).build();
    }


    @GET
    @Path("/finalReport")
    @Authenticated
    public Response getFinalReports(){
        return Response.ok(FinalReport.listAll()).build();
    }


    @GET
    @Path("/article")
    @Authenticated
    public Response getArticles(){return Response.ok(Article.listAll()).build();}

}
