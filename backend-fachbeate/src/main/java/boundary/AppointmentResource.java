package boundary;

import entity.*;
import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import org.hibernate.jdbc.Work;
import org.jboss.logging.Logger;

import java.util.ArrayList;
import java.util.List;

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

         CustomerRequirement cr = CustomerRequirement.findById(id);
         return Response.ok(cr).build();
     }

    @GET
    @Path("/customerRequirement/user")
    @Authenticated
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
            return Response.ok(WorkshopRequirement.find(
                    "select work from WorkshopRequirement work join work.requestedTechnologist tech " +
                        "where tech.email = ?1 and showUser = true",fullname
                    ).list()).build();
        }else if(user == 6) {
            return Response.ok(WorkshopRequirement.find(
                    "company.username = ?1 and showUser = true",
                        fullname
                    ).list()).build();
        }else if(user == 3){
            return Response.ok(WorkshopRequirement.find(
                    "representative.email = ?1 and showUser = true",fullname
                        ).list()).build();
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
        if (user==7) {
            return getVisitorRegistration();
        }else if(user == 6) {
            return Response.ok(VisitorRegistration.find(
                    "creator = ?1 and showUser = true", fullname
                    ).list()).build();
        }else if(user == 3){
            return Response.ok(VisitorRegistration.find(
                    "representative = ?1 and showUser = true",fullname
                    ).list()).build();
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
    @Path("/other/user")
    @Authenticated
    public Response getOtherAppointmentPerUser(@QueryParam("type") int user, @QueryParam("fullname") String fullname){
        if (user==7) {
            return getOtherAppointments();
        }else if(user == 4) {
            return Response.ok(TechnologistAppointment.find(
                    "requestedTechnologist.email", fullname
                    ).list()).build();
        }
        return Response.ok().build();
    }


    @GET
    @Path("/finalReport")
    @Authenticated
    public Response getFinalReports(){
        return Response.ok(FinalReport.listAll()).build();
    }

    @GET
    @Path("/finalReportByUser")
    @Authenticated
    public Response getFinalReportsByUser(@QueryParam("type") int user, @QueryParam("fullname") String fullname){
        if (user==7) {
            return getFinalReports();
        }else if(user == 4) {
            return Response.ok(FinalReport.find(
                    "technologist.email", fullname
                    ).list()).build();
        }else if(user == 6) {
            List<CustomerRequirement> customerRequirements = CustomerRequirement.find(
                    "company.username",
                    fullname
            ).list();

            List<FinalReport> finalReports = new ArrayList<>();
            for (CustomerRequirement cr : customerRequirements) {
                for (CustomerVisit visit : cr.customerVisits) {
                    if(visit.finalReport != null) {
                        finalReports.add(visit.finalReport);
                    }
                }
            }

            return Response.ok(finalReports).build();
        }else if(user == 3){
            return Response.ok(FinalReport.find(
                    "representative.email", fullname
                    ).list()).build();
        }
        return Response.ok().build();
    }

    @POST
    @Path("/finalReport")
    @Authenticated
    @Transactional
    public Response postFinalReport(FinalReport finalReport){
        return Response.ok(finalReport.persistOrUpdate()).build();
    }

    @GET
    @Path("/article")
    @Authenticated
    public Response getArticles(){return Response.ok(Article.listAll()).build();}


    @GET
    @Path("/visibility")
    @Authenticated
    @Transactional
    public Response changeVisibility(@QueryParam("type") int type, @QueryParam("id") int id){
        if(type == 0){
            CustomerRequirement cr = CustomerRequirement.findById(id);
            cr.showUser = !cr.showUser;
            return Response.ok(true).build();
        }else if(type == 1){
            WorkshopRequirement wr = WorkshopRequirement.findById(id);
            wr.showUser = !wr.showUser;
            return Response.ok(true).build();
        }else if(type == 2){
            VisitorRegistration vr = VisitorRegistration.findById(id);
            vr.showUser = !vr.showUser;
            return Response.ok(true).build();
        }

        return Response.ok().build();
    }

}
