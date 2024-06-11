package entity;

import jakarta.persistence.*;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.List;

@Entity
public class CustomerRequirement extends TechnologistAppointment {

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
        this.company = newCustomerRequirement.company;
        this.contact = newCustomerRequirement.contact;
        this.representative = newCustomerRequirement.representative.persistOrUpdate();
        this.furtherNotes = newCustomerRequirement.furtherNotes;
        this.internalNote = newCustomerRequirement.internalNote;

        super.updateEntity( (TechnologistAppointment) newCustomerRequirement);

        for (CustomerVisit visit : newCustomerRequirement.customerVisits) {
            if(visit.id == null || visit.id == 0) {
                this.customerVisits.add(visit.persistOrUpdate());
            }else{
                visit.persistOrUpdate();
            }
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

            this.representative = this.representative.persistOrUpdate();

            return this;
        }else{
            CustomerRequirement customerRequirement = CustomerRequirement.findById(this.id);
            customerRequirement.updateEntity(this);
            return customerRequirement;
        }
    }


}
