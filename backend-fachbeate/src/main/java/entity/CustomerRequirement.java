package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
public class CustomerRequirement extends PanacheEntity {

    @ManyToOne
    public Technologist requestedTechnologist;
    public Date startDate;
    public Date endDate;


    public String releaserManagement;
    public Date releaseManagement;

    public String releaserSupervisor;
    public Date releaseSupervisor;

    public boolean hotelBooking;
    public boolean flightBooking;
    public String reason;

    public String company;
    public String contact;

    @ManyToOne
    public Representative representative;
    // Customer Visits
    @OneToMany(fetch = FetchType.EAGER)
    public List<CustomerVisit> customerVisits;

    // Travel Planing
    public String furtherNotes;
    public String internalNote;

    public CustomerRequirement() {
    }

    @Transactional(Transactional.TxType.REQUIRED)
    public void updateEntity(CustomerRequirement newCustomerRequirement){
        this.startDate = newCustomerRequirement.startDate;
        this.endDate = newCustomerRequirement.endDate;
        this.releaserManagement = newCustomerRequirement.releaserManagement;
        this.releaseManagement = newCustomerRequirement.releaseManagement;
        this.releaserSupervisor = newCustomerRequirement.releaserSupervisor;
        this.releaseSupervisor = newCustomerRequirement.releaseSupervisor;
        this.hotelBooking = newCustomerRequirement.hotelBooking;
        this.flightBooking = newCustomerRequirement.flightBooking;
        this.reason = newCustomerRequirement.reason;

        this.company = newCustomerRequirement.company;
        this.contact = newCustomerRequirement.contact;
        this.representative = newCustomerRequirement.representative.persistOrUpdate();
        this.furtherNotes = newCustomerRequirement.furtherNotes;
        this.internalNote = newCustomerRequirement.internalNote;

        this.customerVisits = new ArrayList<>();
        for (CustomerVisit visit : newCustomerRequirement.customerVisits) {
            this.customerVisits.add(visit.persistOrUpdate());
        }

        if(newCustomerRequirement.requestedTechnologist.id != null && newCustomerRequirement.requestedTechnologist.id != 0) {
            this.requestedTechnologist = Technologist.findById(newCustomerRequirement.requestedTechnologist.id);
            this.requestedTechnologist.updateEntity(newCustomerRequirement.requestedTechnologist);
            return;
        }

        newCustomerRequirement.requestedTechnologist.persist();
        this.requestedTechnologist = newCustomerRequirement.requestedTechnologist;
    }


    @Transactional(Transactional.TxType.REQUIRED)
    public CustomerRequirement persistOrUpdate(){
        if(this.id == null || this.id == 0) {
            this.id = null;
            this.persist();

            for (CustomerVisit visit : this.customerVisits) {
                visit = visit.persistOrUpdate();
            }

            this.representative = this.representative.persistOrUpdate();

            return this;
        }else{
            CustomerRequirement customerRequirement = CustomerRequirement.findById(this.id);
            customerRequirement.updateEntity(this);
            return customerRequirement;
        }
    }


}
