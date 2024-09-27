package boundary;

import com.fasterxml.jackson.databind.ObjectMapper;
import control.FileService;
import entity.*;
import entity.dto.FileUploadRequest;
import entity.dto.MultipleFileUploadRequest;
import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.jboss.logging.Logger;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Path("appointment")
public class AppointmentResource {

    @Inject
    Logger log;

    @Inject
    FileService fileService;

    String FileSaveDir = "/opt/almi/daten/requesttooldaten/";

    /***
     * This method persists a calendar entry
     *
     * @param technologistAppointment
     * @return The persisted entry
     */
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

    /***
     * Returns all other calendar entries, i.e. not
     * Fachberater Anforderung, Besucher Anmeldung or Seminar Anmeldung
     * @return
     */
    @GET
    @Path("/other")
    @Authenticated
    public Response getOtherAppointments(){
        return Response.ok(TechnologistAppointment.listAll()).build();
    }

    /***
     * Deletes calendar entrie, i.e. not
     * @return
     */
    @DELETE
    @Path("/delete")
    @Transactional
    @Authenticated
    public Response deleteAppointment(@QueryParam("id") Long id){
        TechnologistAppointment.deleteById(id);

        return Response.ok(true).build();
    }

    /***
     * Returns another calendar entry with the Id
     * @param id
     * @return
     */
    @GET
    @Path("/other/id")
    @Authenticated
    public Response getOtherAppointmentPerId(@QueryParam("id") Long id){
        return Response.ok(TechnologistAppointment.findById(id)).build();
    }

    /**
     * Returns the other calendar entries
     * that a specific user is allowed to see
     * @param user: Roles from the user which is currently logged in
     * @param fullname: Name from the user which is currently logged in
     * @return
     */
    @GET
    @Path("/other/user")
    @Authenticated
    public Response getOtherAppointmentPerUser(@QueryParam("type") int user, @QueryParam("fullname")List<String> fullname){
        if (user==7) {
            return getOtherAppointments();
        }else if(user == 4) {
            return Response.ok(TechnologistAppointment.find(
                    "requestedTechnologist.email = ?2 or creator = ?1", fullname.get(1), fullname.get(0)
                    ).list()).build();
        }
        return Response.ok().build();
    }


    /***
     * Returns all final reports
     * @return
     */
    @GET
    @Path("/finalReport")
    @Authenticated
    public Response getFinalReports(){
        return Response.ok(FinalReport.listAll()).build();
    }

    /***
     * Returns all final reports that a specific user is allowed to see
     * @param user: Roles from the user which is currently logged in
     * @param fullname: Name from the user which is currently logged in
     * @return
     */
    @GET
    @Path("/finalReportByUser")
    @Authenticated
    public Response getFinalReportsByUser(@QueryParam("type") int user, @QueryParam("fullname") List<String> fullname){
        List<FinalReport> finalReports = new ArrayList<>();

        if (user==7) {
            finalReports = FinalReport.listAll();
        }else if(user == 4) {
            finalReports = FinalReport.find(
                    "technologist.email = ?1 or creator = ?2", fullname.get(1), fullname.get(0)
                    ).list();
        }else if(user == 6) {
            List<CustomerRequirement> customerRequirements = CustomerRequirement.find(
                    "company.username = ?1 or creator = ?1",
                    fullname.get(0)
            ).list();

            for (CustomerRequirement cr : customerRequirements) {
                for (CustomerVisit visit : cr.customerVisits) {
                    if(visit.finalReport != null) {
                        finalReports.add(visit.finalReport);
                    }
                }
            }

        }else if(user == 3){
            finalReports = FinalReport.find(
                    "representative.email = ?1 or creator = ?2", fullname.get(1), fullname.get(0)
                    ).list();
        }else if(user == 8){
           finalReports = FinalReport.find(
                    "representative.email = ?1 or technologist.email = ?1 or creator = ?2"
                    ,fullname.get(1), fullname.get(0)
            ).list();
        }

        finalReports.forEach(element -> element.files = fileService.getFileList(FileSaveDir + "final\\" + element.id));

        return Response.ok(finalReports).build();
    }

    @GET
    @Path("/finalReport/file/{finalReportId}/{fileName}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response getFile(@PathParam("finalReportId") String finalReportId, @PathParam("fileName") String filename) throws FileNotFoundException {
        File file = new File(FileSaveDir+finalReportId, filename);

        if (!file.exists()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        InputStream fileStream = new FileInputStream(file);
        return Response.ok(fileStream)
                .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                .build();
    }


    /**
     * Post a new FinalReport
     * @param finalReport: Report to Persist
     * @return persisted Article
     */
    @POST
    @Path("/finalReport")
    @Authenticated
    @Transactional
    public Response postFinalReport(FinalReport finalReport){
        return Response.ok(finalReport.persistOrUpdate()).build();
    }


    /**
     * @return List of all Articles
     */
    @GET
    @Path("/article")
    @Authenticated
    public Response getArticles(){return Response.ok(Article.listAll()).build();}

    /**
     * "Geschäftsleitung" can change the views of orders in the main list.
     * @param type: Type whether it is a 0. Besucheranmeldung, 1. Fachberateranforderung, 2. Workshopanforderung
     * @param id: Id von der Anforderung
     * @return
     */
    @GET
    @Path("/visibility")
    @Authenticated
    @Transactional
    public Response changeVisibility(@QueryParam("type") int type, @QueryParam("id") int id){
        if(type == 1){
            CustomerRequirement cr = CustomerRequirement.findById(id);
            cr.showUser = !cr.showUser;
            return Response.ok().build();
        }else if(type == 2){
            WorkshopRequirement wr = WorkshopRequirement.findById(id);
            wr.showUser = !wr.showUser;
            return Response.ok().build();
        }else if(type == 0){
            VisitorRegistration vr = VisitorRegistration.findById(id);
            vr.showUser = !vr.showUser;
            return Response.ok().build();
        }
        else if(type == 3){
            BookingRequest vr = BookingRequest.findById(id);
            vr.showUser = !vr.showUser;
            return Response.ok().build();
        }

        return Response.notModified().build();
    }

    @POST
    @Path("upload/{savePath}")
    @Authenticated
    @Transactional
    public void uploadFiles(MultipleFileUploadRequest request, @PathParam("savePath") String savePath) throws IOException {

        fileService.saveFilesToDir(request, savePath, FileSaveDir);


    }


}
