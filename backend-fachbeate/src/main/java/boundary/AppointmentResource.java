package boundary;

import entity.*;
import entity.dto.MainListDTO;
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
    @Path("/other")
    @Transactional
    //@Authenticated
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
    //@Authenticated
    public Response getOtherAppointments(){
        return Response.ok(TechnologistAppointment.listAll().stream().filter(
                element -> !(element instanceof WorkshopRequirement) && !(element instanceof CustomerRequirement)
        )).build();
    }

    @GET
    @Path("/other/id")
    //@Authenticated
    public Response getOtherAppointmentPerId(@QueryParam("id") Long id){
        return Response.ok(TechnologistAppointment.findById(id)).build();
    }

    @GET
    @Path("/other/user")
    //@Authenticated
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
    //@Authenticated
    public Response getFinalReports(){
        return Response.ok(FinalReport.listAll()).build();
    }

    @GET
    @Path("/finalReportByUser")
    //@Authenticated
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
    //@Authenticated
    @Transactional
    public Response postFinalReport(FinalReport finalReport){
        return Response.ok(finalReport.persistOrUpdate()).build();
    }

    @GET
    @Path("/article")
    //@Authenticated
    public Response getArticles(){return Response.ok(Article.listAll()).build();}


    @GET
    @Path("/visibility")
    //@Authenticated
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
