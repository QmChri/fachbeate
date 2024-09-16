package boundary;

import control.MailService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

@Path("Mail")
public class MailResource {

    @Inject
    MailService mailController;

    @GET
    public String getMail(){
        //this.mailController.sendMail();
        return "Mail sent";
    }

}
