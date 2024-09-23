package control;

import entity.MailUser;
import entity.enums.Function;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;
import java.util.stream.Collectors;

@Path("mail")
public class MailUserService implements PanacheRepository<MailUser> {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<MailUser> getAllUsers() {
        return MailUser.listAll();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/gl")
    public List<String> getAllEmailsFromGLDepartment() {
        return MailUser.find("department", Function.GESCHAEFTSLEITUNG)
                .stream()
                .map(user -> ((MailUser) user).email)
                .collect(Collectors.toList());
    }
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/al")
    public List<String> getAllEmailsFromALDepartment() {
        return MailUser.find("department", Function.ABTEILUNGSLEITUNG)
                .stream()
                .map(user -> ((MailUser) user).email)
                .collect(Collectors.toList());
    }
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/frontOffice")
    public List<String> getAllEmailsFromFODepartment() {
        return MailUser.find("department", Function.FRONTOFFICE)
                .stream()
                .map(user -> ((MailUser) user).email)
                .collect(Collectors.toList());
    }
}
