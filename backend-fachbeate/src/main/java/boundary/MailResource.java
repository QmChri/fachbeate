package boundary;

import control.KeycloakService;
import control.MailService;
import entity.*;
import io.quarkus.mailer.Mail;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;

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
    @Path("/sendMail")
    public void sendMail(@QueryParam("groups")List<String> groups, @QueryParam("id") String id, @QueryParam("text") String text, @QueryParam("subject") String subject) {

        Map<String, List<MailUser>> userGroups = keycloakService.getGroupsWithUsers();
        Map<String, List<MailUser>> emails = getSingleEmails(id);

        for(String group : groups) {
            if(group.equalsIgnoreCase("geschaeftsleitung")){
                userGroups.get("geschaeftsleitung").forEach(mailUser -> mailService.sendMailToMailUser(mailUser, subject, text));
            }else if(group.equalsIgnoreCase("abteilungsleitung")){
                userGroups.get("abteilungsleitung").forEach(mailUser -> mailService.sendMailToMailUser(mailUser, subject, text));
            }else if(group.equalsIgnoreCase("front-office")){
                userGroups.get("front-office").forEach(mailUser -> mailService.sendMailToMailUser(mailUser, subject, text));
            }else if(group.equalsIgnoreCase("fachberater")){
                emails.get("fachberater").forEach(mailUser -> mailService.sendMailToMailUser(mailUser, subject, text));
            }else if(group.equalsIgnoreCase("vertreter")){
                emails.get("vertreter").forEach(mailUser -> mailService.sendMailToMailUser(mailUser, subject, text));
            }else if(group.equalsIgnoreCase("creator")){
                emails.get("creator").forEach(mailUser -> mailService.sendMailToMailUser(mailUser, subject, text));
            }
        }
    }

    private Map<String, List<MailUser>> getSingleEmails(String id){

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

}
