package control;

import entity.MailUser;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;

@ApplicationScoped
public class MailService {

    @Inject
    Mailer mailer;

    public void sendMail(List<String> to, String subject, String body) {
        for (String email : to) {
            mailer.send(
                    Mail.withText(
                            email,
                            subject,
                            "Geschätze Damen und Herren! Dieses E-Mail dient als Informatio und wird automatisch generiert, bitte nicht beantworten!"+
                                    body
                    )
            );
        }
    }

}
