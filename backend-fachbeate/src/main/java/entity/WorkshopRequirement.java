package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import jakarta.ws.rs.core.Response;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
public class WorkshopRequirement extends PanacheEntity {


    public boolean showUser;
    @ManyToMany
    public List<Technologist> requestedTechnologist;
    public Date startDate;
    public Date endDate;

    public Date dateOfCreation;

    public String releaserManagement;
    public Date releaseManagement;

    public String releaserSupervisor;
    public Date releaseSupervisor;

    public String creator;
    public String lastEditor;

    public boolean hotelBooking;
    public boolean flightBooking;
    public String reason;

    @ManyToOne
    public Representative representative;

    public String subject;

    @ManyToOne
    public Company company;
    public String customer;

    @OneToMany
    public List<HotelBooking> hotelBookings;

    public int amountParticipants;
    public String travelFrom;
    public String travelType;
    public String language;
    public boolean shouldBeTranslated;
    public String seminarPresenter;

    public String locationAndDesiredPlace;
    public Date locationFromDate;
    public Date locationToDate;
    public int amountSingleRooms;
    public int amountDoubleRooms;

    public Date flightHereDateTime;
    public Date flightReturnDateTime;
    public String flightFrom;
    public String flightTo;
    public String otherTravelRequests;

    // Ausflug
    public boolean trip;
    public Date tripDate;
    public String tripTime;
    public String tripLocation;
    public String otherTripRequests;

    // Tour
    public boolean companyTour;
    public int tourAmount;
    public Date tourDate;
    public String tourTime;
    public boolean languageEnglish;

    //Meal
    public boolean meal;
    public int mealAmount;
    public Date mealDateFrom;
    public Date mealDateTo;
    public String mealTime;

    public int mealWishesVegan;
    public int mealWishesVegetarian;
    public String otherMealWishes;
    public int otherMealWishesAmount;


    public boolean customerPresent;
    public boolean diploma;

    public String otherRequests;

    @OneToMany()
    public List<Guest> guests;

    public WorkshopRequirement() {
    }

    public void updateEntity(WorkshopRequirement newEntity){
        this.showUser = newEntity.showUser;
        this.lastEditor = newEntity.lastEditor;
        this.creator = newEntity.creator;

        this.startDate = newEntity.startDate;
        this.endDate = newEntity.endDate;
        this.releaserManagement = newEntity.releaserManagement;
        this.releaseManagement = newEntity.releaseManagement;
        this.releaserSupervisor = newEntity.releaserSupervisor;
        this.releaseSupervisor = newEntity.releaseSupervisor;
        this.hotelBooking = newEntity.hotelBooking;
        this.flightBooking = newEntity.flightBooking;
        this.reason = newEntity.reason;

        this.subject = newEntity.subject;
        this.company = newEntity.company;
        this.customer = newEntity.customer;
        this.amountParticipants = newEntity.amountParticipants;
        this.travelFrom = newEntity.travelFrom;
        this.travelType = newEntity.travelType;
        this.language = newEntity.language;
        this.shouldBeTranslated = newEntity.shouldBeTranslated;
        this.seminarPresenter = newEntity.seminarPresenter;
        this.locationAndDesiredPlace = newEntity.locationAndDesiredPlace;
        this.locationFromDate = newEntity.locationFromDate;
        this.locationToDate = newEntity.locationToDate;
        this.amountSingleRooms = newEntity.amountSingleRooms;
        this.amountDoubleRooms = newEntity.amountDoubleRooms;

        this.flightHereDateTime = newEntity.flightHereDateTime;
        this.flightReturnDateTime = newEntity.flightReturnDateTime;
        this.flightFrom = newEntity.flightFrom;
        this.flightTo = newEntity.flightTo;
        this.otherTravelRequests = newEntity.otherTravelRequests;

        // Tour
        this.companyTour = newEntity.companyTour;
        this.tourAmount = newEntity.tourAmount;
        this.tourDate = newEntity.tourDate;
        this.tourTime = newEntity.tourTime;
        this.languageEnglish = newEntity.languageEnglish;

        this.trip = newEntity.trip;
        this.tripDate = newEntity.tripDate;
        this.tripTime = newEntity.tripTime;
        this.tripLocation = newEntity.tripLocation;
        this.otherTripRequests = newEntity.otherTripRequests;

        this.meal = newEntity.meal;
        this.mealAmount = newEntity.mealAmount;
        this.mealDateFrom = newEntity.mealDateFrom;
        this.mealDateTo = newEntity.mealDateTo;
        this.mealTime = newEntity.mealTime;
        this.mealWishesVegan = newEntity.mealWishesVegan;
        this.mealWishesVegetarian = newEntity.mealWishesVegetarian;

        this.otherMealWishes = newEntity.otherMealWishes;
        this.otherMealWishesAmount = newEntity.otherMealWishesAmount;
        this.customerPresent = newEntity.customerPresent;
        this.diploma = newEntity.diploma;
        this.otherRequests = newEntity.otherRequests;

        this.company = newEntity.company.persistOrUpdate();

        this.requestedTechnologist = new ArrayList<>();
        for(Technologist tech : newEntity.requestedTechnologist){
            this.requestedTechnologist.add(tech.persistOrUpdate());
        }

        this.hotelBookings = new ArrayList<>();
        for(HotelBooking hotelBooking: newEntity.hotelBookings){
            this.hotelBookings.add(hotelBooking.persistOrUpdate());
        }

        this.guests = new ArrayList<>();
        for(Guest guest: newEntity.guests){
            this.guests.add(guest.persistOrUpdate());
        }

        this.representative = newEntity.representative.persistOrUpdate();

    }

    public WorkshopRequirement persistOrUpdate(){

        if(this.id != null && this.id != 0){
            WorkshopRequirement persisted = WorkshopRequirement.findById(this.id);
            persisted.updateEntity(this);
            return persisted;
        }

        if(this.company != null) {
            this.company = this.company.persistOrUpdate();
        }

        if(this.representative != null) {
            this.representative = this.representative.persistOrUpdate();
        }

        for(Technologist tech : this.requestedTechnologist){
            tech.persistOrUpdate();
        }

        for(HotelBooking hb: this.hotelBookings){
            hb.persistOrUpdate();
        }

        for(Guest guest: this.guests){
            guest.persistOrUpdate();
        }

        this.persist();

        return this;
    }

}
