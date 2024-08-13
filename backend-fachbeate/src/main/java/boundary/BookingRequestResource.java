package boundary;

import entity.BookingRequest;
import entity.CustomerRequirement;
import entity.VisitorRegistration;
import entity.dto.MainListDTO;
import io.quarkus.security.Authenticated;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

import java.util.ArrayList;
import java.util.List;

@Path("/booking")
public class BookingRequestResource {
    private static final Logger LOGGER = Logger.getLogger(BookingRequestResource.class);
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
        return Response.ok(BookingRequest.findById(id)).build();
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
        if (user==7) {
            bookingRequests = BookingRequest.listAll();
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
}

