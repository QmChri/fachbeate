package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import java.util.ArrayList;
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

    @OneToMany
    public List<Guest> guests;

    public VisitorRegistration() {
    }

    public void updateEntity(VisitorRegistration newVisitorRegistration) {
        this.name = newVisitorRegistration.name;
        this.reason = newVisitorRegistration.reason;
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
        this.intOfPeopleTour = newVisitorRegistration.intOfPeopleTour;
        this.tourLanguageEN = newVisitorRegistration.tourLanguageEN;
        this.tourDate = newVisitorRegistration.tourDate;
        this.tourTime = newVisitorRegistration.tourTime;
        this.intOfPeopleMeetingRoom = newVisitorRegistration.intOfPeopleMeetingRoom;
        this.meetingRoomDate = newVisitorRegistration.meetingRoomDate;
        this.meetingRoomTime = newVisitorRegistration.meetingRoomTime;
        this.hotelLocation = newVisitorRegistration.hotelLocation;
        this.hotelStayFromDate = newVisitorRegistration.hotelStayFromDate;
        this.hotelStayToDate = newVisitorRegistration.hotelStayToDate;
        this.singleRooms = newVisitorRegistration.singleRooms;
        this.doubleRooms = newVisitorRegistration.doubleRooms;
        this.lunchNumber = newVisitorRegistration.lunchNumber;
        this.lunchDate = newVisitorRegistration.lunchDate;
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

            return this;
        }else{
            VisitorRegistration visitorRegistration = VisitorRegistration.findById(this.id);
            visitorRegistration.updateEntity(this);
            return visitorRegistration;
        }
    }
}
