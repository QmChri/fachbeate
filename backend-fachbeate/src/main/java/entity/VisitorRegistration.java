package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

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

    @ManyToOne
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
    public int numberOfPeopleMeetingRoom;
    public Date meetingRoomDate;
    public String meetingRoomTime;
    public int lunchNumber;
    public Date mealDateFrom;
    public Date mealDateTo;
    public String lunchTime;
    public int veganMeals;
    public int vegetarianMeals;
    public String otherMealsDescription;
    public int otherMealsNumber;

    public Date transferFromDate;
    public Date transferToDate;
    public String otherTravelRequirements;
    public String transferFrom;
    public String transferTo;

    @OneToMany
    public List<HotelBooking> hotelBookings;
    public boolean hotelBooking;
    public boolean flightBooking;
    public boolean trip;
    public boolean companyTour;
    public boolean meal;
    public boolean customerPresent;
    public boolean diploma;


    @OneToMany
    public List<PlannedDepartmentVisit> plannedDepartmentVisits;

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
        this.numberOfPeopleMeetingRoom = newVisitorRegistration.numberOfPeopleMeetingRoom;
        this.meetingRoomDate = newVisitorRegistration.meetingRoomDate;
        this.meetingRoomTime = newVisitorRegistration.meetingRoomTime;


        this.lunchNumber = newVisitorRegistration.lunchNumber;
        this.mealDateFrom = newVisitorRegistration.mealDateFrom;
        this.mealDateTo = newVisitorRegistration.mealDateTo;
        this.lunchTime = newVisitorRegistration.lunchTime;
        this.veganMeals = newVisitorRegistration.veganMeals;
        this.vegetarianMeals = newVisitorRegistration.vegetarianMeals;
        this.otherMealsDescription = newVisitorRegistration.otherMealsDescription;
        this.otherMealsNumber = newVisitorRegistration.otherMealsNumber;

        this.transferFromDate = newVisitorRegistration.transferFromDate;
        this.transferToDate = newVisitorRegistration.transferToDate;
        this.otherTravelRequirements = newVisitorRegistration.otherTravelRequirements;
        this.transferFrom = newVisitorRegistration.transferFrom;
        this.transferTo = newVisitorRegistration.transferTo;

        this.hotelBooking = newVisitorRegistration.hotelBooking;
        this.flightBooking = newVisitorRegistration.flightBooking;
        this.trip = newVisitorRegistration.trip;
        this.companyTour = newVisitorRegistration.companyTour;
        this.meal = newVisitorRegistration.meal;
        this.customerPresent = newVisitorRegistration.customerPresent;
        this.diploma = newVisitorRegistration.diploma;

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
        for(HotelBooking hotelBooking: newVisitorRegistration.hotelBookings){
            this.hotelBookings.add(hotelBooking.persistOrUpdate());
        }

        this.representative = newVisitorRegistration.representative;
        this.plannedDepartmentVisits = newVisitorRegistration.plannedDepartmentVisits;
    }

    public VisitorRegistration persistOrUpdate(){
        if(this.id == null || this.id == 0) {
            this.id = null;
            this.persist();

            for (PlannedDepartmentVisit visit : this.plannedDepartmentVisits) {
                visit = visit.persistOrUpdate();
            }

            for(Guest guest: this.guests){
                guest.persistOrUpdate();
            }
            for(HotelBooking hotelBooking: this.hotelBookings){
                hotelBooking.persistOrUpdate();
            }

            this.representative.persistOrUpdate();

            return this;
        }else{
            VisitorRegistration visitorRegistration = VisitorRegistration.findById(this.id);
            visitorRegistration.updateEntity(this);
            return visitorRegistration;
        }
    }
}
