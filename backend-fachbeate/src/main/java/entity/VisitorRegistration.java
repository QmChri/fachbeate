package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.annotation.Nullable;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
public class VisitorRegistration extends PanacheEntity {
    public boolean showUser;
    public String releaserManagement;
    public Date releaseManagement;

    public String releaserSupervisor;
    public Date releaseSupervisor;

    public String creator;
    public String lastEditor;
    public Date dateOfCreation;


    @ManyToOne
    @Nullable
    public Representative representative;
    public String reason;

    public String name;
    public String inputReason;
    public Date fromDate;
    public String fromTime;
    public Date toDate;
    public String toTime;
    public String customerOrCompany;
    public String arrivalFromCountry;
    public String reasonForVisit;
    public boolean languageEN;
    public String responsibleSupervisor;
    public Date stayFromDate;
    public String stayFromTime;
    public Date stayToDate;
    public String stayToTime;
    public int numberOfPeopleTour;
    public boolean tourLanguageEN;
    public Date tourDate;
    public String tourTime;
    public int lunchNumber;
    public Date mealDateFrom;
    public Date mealDateTo;
    public String lunchTime;
    public int veganMeals;
    public int halalMeals;
    public String otherMealsDescription;
    public int otherMealsNumber;


    @OneToMany
    public List<FlightBooking> flights;

    @OneToMany
    public List<HotelBooking> hotelBookings;
    public boolean factoryTour;
    public boolean meetingroom;
    public boolean airportTransferTrain;
    public boolean meal;
    public boolean hotelBooking;
    public boolean isPlannedDepartmentVisits;


    @OneToMany
    public List<PlannedDepartmentVisit> plannedDepartmentVisits;

    @OneToMany
    public List<MeetingRoomReservation> meetingRoomReservations;

    @OneToMany
    public List<Guest> guests;

    public VisitorRegistration() {
    }

    public void updateEntity(VisitorRegistration newVisitorRegistration) {

        this.showUser = newVisitorRegistration.showUser;

        this.releaserManagement = newVisitorRegistration.releaserManagement;
        this.releaseManagement = newVisitorRegistration.releaseManagement;

        this.releaserSupervisor = newVisitorRegistration.releaserSupervisor;
        this.releaseSupervisor = newVisitorRegistration.releaseSupervisor;


        this.reason = newVisitorRegistration.reason;

        this.name = newVisitorRegistration.name;
        this.inputReason = newVisitorRegistration.inputReason;
        this.fromDate = newVisitorRegistration.fromDate;
        this.fromTime = newVisitorRegistration.fromTime;
        this.toDate = newVisitorRegistration.toDate;
        this.toTime = newVisitorRegistration.toTime;
        this.customerOrCompany = newVisitorRegistration.customerOrCompany;
        this.arrivalFromCountry = newVisitorRegistration.arrivalFromCountry;
        this.reasonForVisit = newVisitorRegistration.reasonForVisit;
        this.languageEN = newVisitorRegistration.languageEN;
        this.responsibleSupervisor = newVisitorRegistration.responsibleSupervisor;
        this.stayFromDate = newVisitorRegistration.stayFromDate;
        this.stayFromTime = newVisitorRegistration.stayFromTime;
        this.stayToDate = newVisitorRegistration.stayToDate;
        this.stayToTime = newVisitorRegistration.stayToTime;
        this.numberOfPeopleTour = newVisitorRegistration.numberOfPeopleTour;
        this.tourLanguageEN = newVisitorRegistration.tourLanguageEN;
        this.tourDate = newVisitorRegistration.tourDate;
        this.tourTime = newVisitorRegistration.tourTime;


        this.lunchNumber = newVisitorRegistration.lunchNumber;
        this.mealDateFrom = newVisitorRegistration.mealDateFrom;
        this.mealDateTo = newVisitorRegistration.mealDateTo;
        this.lunchTime = newVisitorRegistration.lunchTime;
        this.veganMeals = newVisitorRegistration.veganMeals;
        this.halalMeals = newVisitorRegistration.halalMeals;
        this.otherMealsDescription = newVisitorRegistration.otherMealsDescription;
        this.otherMealsNumber = newVisitorRegistration.otherMealsNumber;

        this.flights = new ArrayList<>();
        for(FlightBooking flight: newVisitorRegistration.flights){
            this.flights.add(flight.persistOrUpdate());
        }

        this.factoryTour = newVisitorRegistration.factoryTour;
        this.meetingroom = newVisitorRegistration.meetingroom;
        this.airportTransferTrain = newVisitorRegistration.airportTransferTrain;
        this.meal = newVisitorRegistration.meal;
        this.hotelBooking = newVisitorRegistration.hotelBooking;
        this.isPlannedDepartmentVisits = newVisitorRegistration.isPlannedDepartmentVisits;

        for (PlannedDepartmentVisit visit : newVisitorRegistration.plannedDepartmentVisits) {
            if(visit.id == null || visit.id == 0) {
                visit.id = null;
                visit.persist();
                this.plannedDepartmentVisits.add(visit);
            }else{
                PlannedDepartmentVisit persisted = PlannedDepartmentVisit.findById(visit.id);
                persisted.updateEntity(visit);
            }
        }

        this.guests = new ArrayList<>();
        for(Guest guest: newVisitorRegistration.guests){
            this.guests.add(guest.persistOrUpdate());
        }

        this.hotelBookings = new ArrayList<>();
        for(HotelBooking hb: newVisitorRegistration.hotelBookings){
            this.hotelBookings.add(hb.persistOrUpdate());
        }

        this.meetingRoomReservations = new ArrayList<>();
        for(MeetingRoomReservation mrr: newVisitorRegistration.meetingRoomReservations){
            this.meetingRoomReservations.add(mrr.persistOrUpdate());
        }

        this.representative = newVisitorRegistration.representative;
        this.plannedDepartmentVisits = newVisitorRegistration.plannedDepartmentVisits;
    }

    @Transactional
    public VisitorRegistration persistOrUpdate(){
        if(this.id == null || this.id == 0) {
            this.id = null;
            for (PlannedDepartmentVisit visit : this.plannedDepartmentVisits) {
                visit = visit.persistOrUpdate();
            }

            for(Guest guest: this.guests){
                guest.persistOrUpdate();
            }

            for(HotelBooking hotelBooking: this.hotelBookings){
                hotelBooking.persistOrUpdate();
            }

            for(MeetingRoomReservation mrr: this.meetingRoomReservations){
                mrr.persistOrUpdate();
            }

            for(FlightBooking fb: this.flights){
                fb.persistOrUpdate();
            }

            if(this.representative != null) {
                this.representative.persistOrUpdate();
            }

            this.persist();
            return this;
        }else{
            VisitorRegistration visitorRegistration = VisitorRegistration.findById(this.id);
            visitorRegistration.updateEntity(this);
            return visitorRegistration;
        }
    }
}
