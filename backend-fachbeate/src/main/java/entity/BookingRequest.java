package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.transaction.Transactional;

import java.util.ArrayList;
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
    public String assumptionOfCosts;


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
    public String alternativeTrainFrom;
    public String trainTo;
    public String alternativeTrainTo;

    public boolean hotelBooking;
    public String hotelLocation;
    public Date hotelFrom;
    public Date hotelTo;
    public String otherHotelNotes;

    public boolean carRental;
    public String carLocation;
    public Date carFrom;
    public Date carTo;
    public String otherCarNotes;

    public BookingRequest() {    }

    @Transactional(Transactional.TxType.REQUIRED)
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
        this.assumptionOfCosts = newEntity.assumptionOfCosts;

        this.flightBookingMultiLeg = newEntity.flightBookingMultiLeg;
        this.flights = new ArrayList<>();
        for(AdvancedFlightBooking flight: newEntity.flights){
            this.flights.add(flight.persistOrUpdate());
        }
        this.flightBookingRoundTrip = newEntity.flightBookingRoundTrip;
        this.flightFrom = newEntity.flightFrom;
        this.alternativeFlightFrom = newEntity.alternativeFlightFrom;
        this.flightTo = newEntity.flightTo;
        this.alternativeFlightTo = newEntity.alternativeFlightTo;

        this.trainTicketBooking = newEntity.trainTicketBooking;
        this.trainFrom = newEntity.trainFrom;
        this.alternativeTrainFrom = newEntity.alternativeTrainFrom;
        this.trainTo = newEntity.trainTo;
        this.alternativeTrainTo = newEntity.alternativeTrainTo;

        this.hotelBooking = newEntity.hotelBooking;
        this.hotelLocation = newEntity.hotelLocation;
        this.hotelFrom = newEntity.hotelFrom;
        this.hotelTo = newEntity.hotelTo;
        this.otherHotelNotes = newEntity.otherHotelNotes;

        this.carRental = newEntity.carRental;
        this.carLocation = newEntity.carLocation;
        this.carFrom = newEntity.carFrom;
        this.carTo = newEntity.carTo;
        this.otherCarNotes = newEntity.otherCarNotes;
    }

    @Transactional(Transactional.TxType.REQUIRED)
    public BookingRequest persistOrUpdate(){
        if(this.id != null && this.id != 0){
            BookingRequest persisted = BookingRequest.findById(this.id);
            persisted.updateEntity(this);
            return persisted;
        }

        this.id = null;
        for (AdvancedFlightBooking fb : this.flights) {
            fb.persistOrUpdate();
        }

        this.persist();
        return this;
    }
}
