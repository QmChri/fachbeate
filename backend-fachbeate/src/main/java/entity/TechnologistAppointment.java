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

    public boolean hotelBooking;
    public boolean flightBooking;


    public TechnologistAppointment() {
    }

    protected void updateEntity(TechnologistAppointment newTechnoloigstAppointment) {
        this.requestedTechnologist = newTechnoloigstAppointment.requestedTechnologist;
        this.startDate = newTechnoloigstAppointment.startDate;
        this.endDate = newTechnoloigstAppointment.endDate;
        this.releaserManagement = newTechnoloigstAppointment.releaserManagement;
        this.releaseManagement = newTechnoloigstAppointment.releaseManagement;
        this.releaserSupervisor = newTechnoloigstAppointment.releaserSupervisor;
        this.releaseSupervisor = newTechnoloigstAppointment.releaseSupervisor;
        this.hotelBooking = newTechnoloigstAppointment.hotelBooking;
        this.flightBooking = newTechnoloigstAppointment.flightBooking;
    }
}
