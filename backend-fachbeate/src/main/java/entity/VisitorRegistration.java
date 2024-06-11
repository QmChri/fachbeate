package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import java.util.Date;
import java.util.List;

@Entity
public class VisitorRegistration extends PanacheEntity {

    public String name;                                  
    public String reason;
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
    public int intOfPeopleTour;
    public boolean tourLanguageEN;
    public Date tourDate;
    public String tourTime;
    public int intOfPeopleMeetingRoom;
    public Date meetingRoomDate;
    public String meetingRoomTime;
    public String hotelLocation;
    public Date hotelStayFromDate;
    public Date hotelStayToDate;
    public int singleRooms;
    public int doubleRooms;
    public int lunchNumber;
    public Date lunchDate;
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
    public List<PlannedDepartmentVisit> plannedDepartmentVisits;

    public VisitorRegistration() {
    }

}
