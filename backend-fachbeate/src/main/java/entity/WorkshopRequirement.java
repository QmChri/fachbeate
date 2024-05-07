package entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

import java.time.LocalDate;

@Entity
public class WorkshopRequirement extends TechnologistAppointment{

    public String subject;
    public String company;
    public int  amountParticipants;
    public String travelFrom;
    public String travelType;
    public String language;
    public boolean shouldBeTranslated;
    public String seminarPresenter;


    public WorkshopRequirement() {
    }
}
