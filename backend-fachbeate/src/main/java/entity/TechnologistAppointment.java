package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;

import java.time.LocalDate;

@Entity
public class TechnologistAppointment extends PanacheEntity {
    public String requestedTechnologist;
    public LocalDate startDate;
    public LocalDate endDate;

    public TechnologistAppointment(String requestedTechnologist, LocalDate startDate, LocalDate endDate) {
        this.requestedTechnologist = requestedTechnologist;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public TechnologistAppointment() {
    }
}
