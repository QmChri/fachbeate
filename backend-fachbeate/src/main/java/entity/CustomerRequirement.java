package entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
public class CustomerRequirement extends TechnologistAppointment {

    public String company;
    public String contact;
    public String representative;
    // Customer Visits
    @OneToMany(cascade = CascadeType.ALL)
    public List<CustomerVisit> customerVisits;


    // Travel Planing
    public String flightBooking;
    public String hotelBooking;

    public String furtherNotes;
    public String internalNote;

    public CustomerRequirement() {
    }

}
