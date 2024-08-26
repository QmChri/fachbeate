package boundary;

import com.fasterxml.jackson.databind.ObjectMapper;
import entity.*;
import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.jboss.logging.Logger;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Path("appointment")
public class AppointmentResource {

    @Inject
    Logger log;

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
        if (user==7) {
            return getFinalReports();
        }else if(user == 4) {
            return Response.ok(FinalReport.find(
                    "technologist.email = ?1 or creator = ?2", fullname.get(1), fullname.get(0)
                    ).list()).build();
        }else if(user == 6) {
            List<CustomerRequirement> customerRequirements = CustomerRequirement.find(
                    "company.username = ?1 or creator = ?1",
                    fullname.get(0)
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
                    "representative.email = ?1 or creator = ?2", fullname.get(1), fullname.get(0)
                    ).list()).build();
        }else if(user == 8){
            return Response.ok(FinalReport.find(
                    "representative.email = ?1 or technologist.email = ?1 or creator = ?2"
                    ,fullname.get(1), fullname.get(0)
            ).list()).build();
        }
        return Response.ok().build();
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


    @POST
    @Path("/finalReportMulti")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Authenticated
    @Transactional
    public Response finalWithFiles(@RequestBody MultipartFormDataInput input) throws IOException {
        Map<String, List<InputPart>> inputStreams = input.getFormDataMap();

        FinalReport finalReport = new ObjectMapper().readValue(inputStreams.get("finalReport").get(0).getBodyAsString(), FinalReport.class);
        finalReport.persistOrUpdate();

        if (finalReport.id == null) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Failed to retrieve FinalReport ID").build();
        }

        if (input.getFormDataMap().get("files") != null && !input.getFormDataMap().get("files").isEmpty()) {
            File directory = new File("uploads/" + finalReport.id);
            if (!directory.exists()) {
                directory.mkdirs(); // Create the directory if it doesn't exist
            }

            for (InputPart part : input.getFormDataMap().get("files")) {
                String fileName = getFileName(part); // Implement this method to get file name
                InputStream inputStream = part.getBody(InputStream.class, null);
                File file = new File(directory, fileName);

                try (FileOutputStream outputStream = new FileOutputStream(file)) {
                    byte[] buffer = new byte[1024];
                    int bytesRead;
                    while ((bytesRead = inputStream.read(buffer)) != -1) {
                        outputStream.write(buffer, 0, bytesRead);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                    return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
                }
            }
        }

        return Response.ok(finalReport).build();
    }

    private String getFileName(InputPart part) {
        // Extract file name from part headers
        MultivaluedMap<String, String> headers = part.getHeaders();
        String contentDisposition = headers.getFirst("Content-Disposition");
        String[] contentDispositionParts = contentDisposition.split(";");
        for (String partStr : contentDispositionParts) {
            if (partStr.trim().startsWith("filename")) {
                return partStr.substring(partStr.indexOf('=') + 1).trim().replace("\"", "");
            }
        }
        return "unknown";
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



}
