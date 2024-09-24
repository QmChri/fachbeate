package entity;

import entity.dto.FileDtos;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.annotation.Nullable;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;
import jakarta.transaction.Transactional;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;

@Entity
public class BookingRequest extends PanacheEntity {
    public Date dateOfCreation;
    public boolean showUser;

    public String releaserManagement;
    public Date releaseManagement;

    public String releaserSupervisor;
    public Date releaseSupervisor;

    public String creator;
    public String lastEditor;

    public String employeeNameAndCompany;
    public String reasonForTrip;
    public Date mainStartDate;
    public Date mainEndDate;
    public String otherNotes;


    public boolean flightBookingMultiLeg;

    @OneToMany
    public List<AdvancedFlightBooking> flights;

    public boolean flightBookingRoundTrip;
    public String flightFrom;
    public String alternativeFlightFrom;
    public String flightTo;
    public String alternativeFlightTo;

    public boolean trainTicketBooking;
    public String trainFrom;
    public String trainStartDate;
    public String trainTo;
    public String trainEndDate;
    public String trainOtherNotes;

    public boolean hotelBooking;
    @OneToMany
    public List<HotelBooking> hotelBookings;

    public boolean otherReq;
    public String preferredTime;
    public String windowCorridor;
    public Integer luggageCount;
    public String luggageWeight;
    public String otherReqOtherNotes;

    public boolean carRental;
    public String carLocation;
    public Date carFrom;
    public Date carTo;
    public String otherCarNotes;

    @Transient
    public List<FileDtos> files;

    public BookingRequest() {    }

    public void updateEntity(BookingRequest newEntity){
        this.showUser = newEntity.showUser;

        this.releaserManagement = newEntity.releaserManagement;
        this.releaseManagement = newEntity.releaseManagement;

        this.releaserSupervisor = newEntity.releaserSupervisor;
        this.releaseSupervisor = newEntity.releaseSupervisor;

        this.creator = newEntity.creator;
        this.lastEditor = newEntity.lastEditor;

        this.employeeNameAndCompany = newEntity.employeeNameAndCompany;
        this.reasonForTrip = newEntity.reasonForTrip;
        this.mainStartDate = newEntity.mainStartDate;
        this.mainEndDate = newEntity.mainEndDate;
        this.otherNotes = newEntity.otherNotes;

        this.flightBookingMultiLeg = newEntity.flightBookingMultiLeg;

        this.flights = new ArrayList<>();
        for(AdvancedFlightBooking fl: newEntity.flights){
            this.flights.add(fl.persistOrUpdate());
        }

        this.otherReq = newEntity.otherReq;
        this.preferredTime = newEntity.preferredTime;
        this.windowCorridor = newEntity.windowCorridor;
        this.luggageCount = newEntity.luggageCount;
        this.luggageWeight = newEntity.luggageWeight;
        this.otherReqOtherNotes = newEntity.otherReqOtherNotes;

        this.flightBookingRoundTrip = newEntity.flightBookingRoundTrip;
        this.flightFrom = newEntity.flightFrom;
        this.alternativeFlightFrom = newEntity.alternativeFlightFrom;
        this.flightTo = newEntity.flightTo;
        this.alternativeFlightTo = newEntity.alternativeFlightTo;

        this.trainTicketBooking = newEntity.trainTicketBooking;
        this.trainFrom = newEntity.trainFrom;
        this.trainStartDate = newEntity.trainStartDate;
        this.trainTo = newEntity.trainTo;
        this.trainEndDate = newEntity.trainEndDate;
        this.trainOtherNotes = newEntity.trainOtherNotes;

        this.hotelBooking = newEntity.hotelBooking;

        this.hotelBookings = new ArrayList<>();
        for(HotelBooking hl: newEntity.hotelBookings){
            this.hotelBookings.add(hl.persistOrUpdate());
        }

        this.carRental = newEntity.carRental;
        this.carLocation = newEntity.carLocation;
        this.carFrom = newEntity.carFrom;
        this.carTo = newEntity.carTo;
        this.otherCarNotes = newEntity.otherCarNotes;
    }

    @Transactional
    public BookingRequest persistOrUpdate(){
        if(this.id == null || this.id == 0) {
            this.id = null;

           // if (this.flights != null) {
                for (AdvancedFlightBooking fl : this.flights) {
                    fl.persistOrUpdate();
                }
            for (HotelBooking hl : this.hotelBookings) {
                hl.persistOrUpdate();
            }
            //}

            this.persist();
            return this;
        }else{
            BookingRequest br = BookingRequest.findById(this.id);
            br.updateEntity(this);
            return br;
        }
    }
}
