package control;

import entity.MailUser;
import io.quarkus.logging.Log;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;

@ApplicationScoped
public class MailService {

    @Inject
    Mailer mailer;

    public void sendMailToMailUser(MailUser mailUser, String subject, String text) {
        // Später können wir noch mit dem mailUser den Benutzernamen oder ähnliches einfügen

         mailer.send(
                Mail.withText(
                        mailUser.email,
                        subject,
                        "Geschätze Damen und Herren! Dieses E-Mail dient als Information " +
                                "und wird automatisch generiert, bitte nicht beantworten!"+
                                text
                )
        );
    }
}
