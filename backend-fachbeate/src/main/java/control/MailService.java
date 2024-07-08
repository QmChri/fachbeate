package control;

import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class MailService {

    @Inject
    Mailer mailer;

    public void sendTestMail(){
        mailer.send(
                Mail.withText(
                        "hier@mail.com",
                        "Testemail für Fachberaterprogramm",
                        "Das hier ist eine Testemail um zu Prüfen ob es Funktioniert \n dies hier sollte in der nächsten zeile stehen"
                )
        );
    }

}
