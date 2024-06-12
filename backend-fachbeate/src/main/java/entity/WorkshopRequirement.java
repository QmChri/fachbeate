package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
public class WorkshopRequirement extends PanacheEntity {


    @ManyToMany
    public List<Technologist> requestedTechnologist;
    public Date startDate;
    public Date endDate;


    public String releaserManagement;
    public Date releaseManagement;

    public String releaserSupervisor;
    public Date releaseSupervisor;

    public boolean hotelBooking;
    public boolean flightBooking;
    public String reason;


    public String subject;
    public String company;
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
    public Date tripDateTime;
    public String tripLocation;
    public String otherTripRequests;

    // Tour
    public boolean companyTour;
    public int tourAmount;
    public Date tourDateTime;
    public boolean languageEnglish;

    //Meal
    public boolean meal;
    public int mealAmount;
    public Date mealDateTime;
    public int mealWishesVegan;
    public int mealWishesVegetarian;
    public String otherMealWishes;
    public int otherMealWishesAmount;


    public boolean customerPresent;
    public boolean diploma;

    public String otherRequests;

    public WorkshopRequirement() {
    }

    public void updateEntity(WorkshopRequirement newEntity){
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
        this.tourDateTime = newEntity.tourDateTime;
        this.languageEnglish = newEntity.languageEnglish;

        this.trip = newEntity.trip;
        this.tripDateTime = newEntity.tripDateTime;
        this.tripLocation = newEntity.tripLocation;
        this.otherTripRequests = newEntity.otherTripRequests;
        this.mealAmount = newEntity.mealAmount;
        this.mealDateTime = newEntity.mealDateTime;
        this.mealWishesVegan = newEntity.mealWishesVegan;
        this.mealWishesVegetarian = newEntity.mealWishesVegetarian;
        this.otherMealWishes = newEntity.otherMealWishes;
        this.otherMealWishesAmount = newEntity.otherMealWishesAmount;
        this.customerPresent = newEntity.customerPresent;
        this.diploma = newEntity.diploma;
        this.otherRequests = newEntity.otherRequests;

        this.requestedTechnologist = new ArrayList<>();

        for(Technologist tech : newEntity.requestedTechnologist){

            this.requestedTechnologist.add(tech.persistOrUpdate());
        }
    }

}
