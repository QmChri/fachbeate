package entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

import java.util.Date;

@Entity
public class WorkshopRequirement extends TechnologistAppointment{

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
    public int[] mealWishes;
    public String otherMealWishes;


    public boolean customerPresent;
    public boolean diploma;

    public String otherRequests;

    public WorkshopRequirement() {
    }

    public void updateEntity(WorkshopRequirement newEntity){
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
        this.trip = newEntity.trip;
        this.tripDateTime = newEntity.tripDateTime;
        this.tripLocation = newEntity.tripLocation;
        this.otherTripRequests = newEntity.otherTripRequests;
        this.meal = newEntity.meal;
        this.mealAmount = newEntity.mealAmount;
        this.mealDateTime = newEntity.mealDateTime;
        this.mealWishes = newEntity.mealWishes;
        this.otherMealWishes = newEntity.otherMealWishes;
        this.customerPresent = newEntity.customerPresent;
        this.diploma = newEntity.diploma;
        this.otherRequests = newEntity.otherRequests;

        super.updateEntity((TechnologistAppointment) newEntity);
    }

}
