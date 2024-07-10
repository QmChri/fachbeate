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

    public boolean showUser;
    @ManyToOne
    public Technologist requestedTechnologist;
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
    public Company company;
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
        this.showUser = newCustomerRequirement.showUser;

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
        this.furtherNotes = newCustomerRequirement.furtherNotes;
        this.internalNote = newCustomerRequirement.internalNote;

        this.customerVisits = new ArrayList<>();
        for (CustomerVisit visit : newCustomerRequirement.customerVisits) {
            this.customerVisits.add(visit.persistOrUpdate());
        }

        if(newCustomerRequirement.representative != null){
            this.representative = newCustomerRequirement.representative.persistOrUpdate();
        }

        if(newCustomerRequirement.requestedTechnologist != null){
            this.requestedTechnologist = newCustomerRequirement.requestedTechnologist.persistOrUpdate();
        }
    }


    @Transactional(Transactional.TxType.REQUIRED)
    public CustomerRequirement persistOrUpdate(){
        if(this.id == null || this.id == 0) {
            this.id = null;
            this.persist();

            for (CustomerVisit visit : this.customerVisits) {
                visit = visit.persistOrUpdate();
            }

            if(this.representative != null) {
                this.representative = this.representative.persistOrUpdate();
            }

            if(this.requestedTechnologist != null) {
                this.requestedTechnologist = this.requestedTechnologist.persistOrUpdate();
            }
            if(this.company != null) {
                this.company = this.company.persistOrUpdate();
            }

            return this;
        }else{
            CustomerRequirement customerRequirement = CustomerRequirement.findById(this.id);
            customerRequirement.updateEntity(this);
            return customerRequirement;
        }
    }


}
