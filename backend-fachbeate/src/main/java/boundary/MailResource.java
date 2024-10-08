package boundary;

import control.KeycloakService;
import control.MailService;
import entity.*;
import entity.enums.Function;
import io.quarkus.mailer.Mail;
import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("mail")
public class MailResource {

    @Inject
    MailService mailService;

    @Inject
    KeycloakService keycloakService;

    @GET
    @Path("/test")
    @Produces(MediaType.TEXT_PLAIN)
    @Authenticated
    public Response mail(){
        mailService.sendMail("christoph.handel@icloud.com");
        mailService.sendMail("ablingerraphael@gmail.com");
        return Response.ok("Mail ist im Anflug").build();
    }

    @POST
    @Path("/sendMail")
    @Authenticated
    public Response sendMail(MailRequest mailRequest) {
        Map<String, List<MailUser>> userGroups = keycloakService.getGroupsWithUsers();
        Map<String, List<MailUser>> emails = getSingleEmails(mailRequest.id);

        for(String group : mailRequest.groups) {
            if(group.equalsIgnoreCase("geschaeftsleitung")){
                userGroups.get("geschaeftsleitung").forEach(mailUser -> mailService.sendMailToMailUser(mailUser, mailRequest.subject, mailRequest.text));
            }else if(group.equalsIgnoreCase("abteilungsleitung")){
                userGroups.get("abteilungsleitung").forEach(mailUser -> mailService.sendMailToMailUser(mailUser, mailRequest.subject, mailRequest.text));
            }else if(group.equalsIgnoreCase("front-office")){
                userGroups.get("front-office").forEach(mailUser -> mailService.sendMailToMailUser(mailUser, mailRequest.subject, mailRequest.text));
            }else if(group.equalsIgnoreCase("fachberater") && !emails.isEmpty()){
                emails.get("fachberater").forEach(mailUser -> mailService.sendMailToMailUser(mailUser, mailRequest.subject, mailRequest.text));
            }else if(group.equalsIgnoreCase("vertreter") && !emails.isEmpty()){
                emails.get("vertreter").forEach(mailUser -> mailService.sendMailToMailUser(mailUser, mailRequest.subject, mailRequest.text));
            }else if(group.equalsIgnoreCase("creator") && !emails.isEmpty()){
                emails.get("creator").forEach(mailUser -> mailService.sendMailToMailUser(mailUser, mailRequest.subject, mailRequest.text));
            }
        }

        return Response.ok().build();
    }

    Map<String, List<MailUser>> getSingleEmails(String id){
        if(id == null || id.isEmpty()){
            return new HashMap<>();
        }
         String type = id.split("_")[0];

         List<MailUser> customers = keycloakService.getAllUsers();

        Map<String, List<MailUser>> mails = new HashMap<>();

         if(type.equalsIgnoreCase("F")){
             CustomerRequirement customerRequirement = CustomerRequirement.findById(id.split("_")[1]);

             mails.put("fachberater", customers.stream().filter(element -> element.email.equals(customerRequirement.requestedTechnologist.email)).toList());

             mails.put("vertreter", customers.stream().filter(element -> element.email.equals(customerRequirement.representative.email)).toList());

             mails.put("creator",customers.stream()
                     .filter(element -> element.userName.equalsIgnoreCase(customerRequirement.creator))
                     .toList());

         }else if(type.equalsIgnoreCase("B")){
             VisitorRegistration visitorRegistration = VisitorRegistration.findById(id.split("_")[1]);

             if(visitorRegistration.representative != null) {
                 mails.put("vertreter", customers.stream().filter(element -> element.email.equals(visitorRegistration.representative.email)).toList());
             }

             mails.put("creator",customers.stream()
                     .filter(element -> element.userName.equalsIgnoreCase(visitorRegistration.creator))
                     .toList());

         }else if(type.equalsIgnoreCase("S")){
             WorkshopRequirement workshopRequirement = WorkshopRequirement.findById(id.split("_")[1]);

             mails.put("fachberater", customers.stream().filter(element ->
                     workshopRequirement.requestedTechnologist.stream().map(tech -> tech.email).toList().contains(element.email)
            ).toList());

             mails.put("vertreter", customers.stream().filter(element -> element.email.equals(workshopRequirement.representative.email)).toList());


             mails.put("creator",customers.stream().filter(element -> element.userName.equalsIgnoreCase(workshopRequirement.creator)).toList());

         }else if(type.equalsIgnoreCase("R")){
             BookingRequest bookingRequest = BookingRequest.findById(id.split("_")[1]);

             mails.put("creator",customers.stream().filter(element -> element.userName.equalsIgnoreCase(bookingRequest.creator)).toList());

         }
         else if(type.equalsIgnoreCase("A")){
             FinalReport finalReport = FinalReport.findById(id.split("_")[1]);

             mails.put("vertreter", customers.stream().filter(element -> element.email.equals(finalReport.representative.email)).toList());
             mails.put("fachberater", customers.stream().filter(element -> element.email.equals(finalReport.technologist.email)).toList());
             mails.put("creator",customers.stream()
                     .filter(element -> element.userName.equalsIgnoreCase(finalReport.creator))
                     .toList());
         }

         return mails;

    }


    @POST
    @Path("/sendToAddress")
    @Authenticated
    public Response sendToAddress(MailRequest mailRequest) {

        MailUser mailUser = new MailUser();
        mailUser.email = mailRequest.groups.get(0);
        mailUser.firstName = "Test";
        mailUser.lastName = "User";
        mailUser.function = Function.ADMIN;

        mailService.sendMailToMailUser(mailUser, mailRequest.subject, mailRequest.text);

        return Response.ok().build();
    }

}
