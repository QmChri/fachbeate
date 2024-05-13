package entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

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


    public boolean hotelBooking;
    public String locationAndDesiredPlace;
    public LocalDate locationFromDate;
    public LocalDate locationToDate;
    public int amountSingleRooms;
    public int amountDoubleRooms;

    public boolean flightBooking;
    public LocalDateTime flightHereDateTime;
    public LocalDateTime flightReturnDateTime;
    public String flightFrom;
    public String flightTo;
    public String otherTravelRequests;

    // Ausflug
    public boolean trip;
    public LocalDateTime tripDateTime;
    public String tripLocation;
    public String otherTripRequests;

    //Meal
    public boolean meal;
    public int mealAmount;
    public LocalDateTime mealDateTime;
    public int[] mealWishes;
    public boolean customerPresent;
    public boolean diploma;
    public String otherRequests;

    public WorkshopRequirement() {
    }
}
