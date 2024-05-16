package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class TechnologistAppointment extends PanacheEntity {

    @ManyToOne
    public Technologist requestedTechnologist;
    public LocalDate startDate;
    public LocalDate endDate;

    public String releaserManagement;
    public LocalDate releaseManagement;

    public String releaserSupervisor;
    public LocalDate releaseSupervisor;

    public TechnologistAppointment() {
    }
}
