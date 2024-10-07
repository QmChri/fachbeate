package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.util.Date;

@Entity
public class TechnologistAppointment extends PanacheEntity {

    @ManyToOne
    public Technologist requestedTechnologist;
    public Date startDate;
    public Date endDate;


    public String releaserManagement;
    public Date releaseManagement;

    public String releaserSupervisor;
    public Date releaseSupervisor;

    public boolean hotelBooking;
    public boolean flightBooking;
    public String reason;
    public String creator;


    public TechnologistAppointment() {
    }

    public void updateEntity(TechnologistAppointment newTechnologistAppointment) {
        this.startDate = newTechnologistAppointment.startDate;
        this.endDate = newTechnologistAppointment.endDate;
        this.releaserManagement = newTechnologistAppointment.releaserManagement;
        this.releaseManagement = newTechnologistAppointment.releaseManagement;
        this.releaserSupervisor = newTechnologistAppointment.releaserSupervisor;
        this.releaseSupervisor = newTechnologistAppointment.releaseSupervisor;
        this.hotelBooking = newTechnologistAppointment.hotelBooking;
        this.flightBooking = newTechnologistAppointment.flightBooking;
        this.reason = newTechnologistAppointment.reason;
        this.creator = newTechnologistAppointment.creator;

        if(newTechnologistAppointment.requestedTechnologist.id != null && newTechnologistAppointment.requestedTechnologist.id != 0) {
            this.requestedTechnologist = Technologist.findById(newTechnologistAppointment.requestedTechnologist.id);
            this.requestedTechnologist.updateEntity(newTechnologistAppointment.requestedTechnologist);
            return;
        }

        newTechnologistAppointment.requestedTechnologist.persist();
        this.requestedTechnologist = newTechnologistAppointment.requestedTechnologist;
    }
}
