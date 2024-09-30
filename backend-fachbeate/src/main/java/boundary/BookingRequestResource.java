package boundary;

import com.fasterxml.jackson.databind.ObjectMapper;
import control.FileService;
import entity.BookingRequest;
import entity.dto.MainListDTO;
import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

import java.io.*;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Path("/booking")
public class BookingRequestResource {

    @Inject
    FileService fileService;

    String FileSaveDir = "/opt/almi/daten/requesttooldaten/";

    final Date FIVE_DAYS_AGO = Date.from(LocalDate.now().minusDays(5).atStartOfDay(ZoneId.systemDefault()).toInstant());


    /**
     * Post a new Booking Request
     * @param bookingRequest: Entity to persist
     * @return persisted Entity
     */
    @POST
    @Authenticated
    @Transactional
    public Response postBookingRequest(BookingRequest bookingRequest){
    /*    LOGGER.info(bookingRequest);
        if (bookingRequest.flights == null){
            LOGGER.info(bookingRequest.flights);
            bookingRequest.flights = new ArrayList<>();
        }*/
        BookingRequest responsebookingRequest = bookingRequest.persistOrUpdate();
        if(responsebookingRequest == null){
            return Response.serverError().build();
        }
        return Response.ok(responsebookingRequest).build();
    }

    /**
     * List all Bookings
     * @return
     */
    @GET
    @Authenticated
    public Response getBookingRequest(){
        return Response.ok(BookingRequest.listAll()).build();
    }

    /**
     * Get Booking by id
     * @return
     */
    @GET
    @Path("/id")
    @Authenticated
    public Response getBookingRequestPerId(@QueryParam("id") Long id){


        BookingRequest bookingRequest = BookingRequest.findById(id);

        bookingRequest.files = fileService.getFileList(FileSaveDir + bookingRequest.id);

        return Response.ok(
            bookingRequest
        ).build();
    }

    /**
     * Returns all BookingRequest that a specific user is allowed to see
     * @param user: Roles from the user which is currently logged in
     * @param fullname: Name from the user which is currently logged in
     * @return
     */
    @GET
    @Path("/user")
    @Authenticated
    public Response getBookingRequestPerUser(@QueryParam("type") int user, @QueryParam("fullname") List<String> fullname){
        List<BookingRequest> bookingRequests = new ArrayList<>();
        if (user==7 || user==5) {
            bookingRequests = BookingRequest.list("mainEndDate >= ?1", FIVE_DAYS_AGO);
        }
        /*
        }else if(user == 4) {
            bookingRequests = BookingRequest.find("(requestedTechnologist.email = ?1 or creator = ?2) and showUser = true",
                    fullname.get(1), fullname.get(0)).list();
        } else if(user == 6) {
            bookingRequests = BookingRequest.find(
                    "(company.username = ?1 or creator = ?1) and showUser = true",
                    fullname.get(0)
            ).list();
        } else if(user == 3){
            bookingRequests = BookingRequest.find(
                    "(representative.email = ?1 or creator = ?2) and showUser = true",fullname.get(1), fullname.get(0)
            ).list();
        }else if(user == 8){
            bookingRequests = BookingRequest.find(
                    "(representative.email = ?1 or requestedTechnologist.email = ?1 or creator = ?2) and showUser = true", fullname.get(1), fullname.get(0)
            ).list();
        }*/

        return Response.ok(bookingRequests.stream().map(req -> new MainListDTO().mapBookingToMainListDTO(req)).toList()).build();
    }


    @GET
    @Path("/file/{bookingId}/{fileName}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response getFile(@PathParam("bookingId") String bookingId, @PathParam("fileName") String filename) throws FileNotFoundException {
        File file = new File(FileSaveDir+bookingId, filename);

        if (!file.exists()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        InputStream fileStream = new FileInputStream(file);
        return Response.ok(fileStream)
                .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                .build();
    }

}

