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
    @OneToMany
    public List<CustomerVisit> customerVisits;

    // Travel Planing
    public String furtherNotes;
    public String internalNote;

    public CustomerRequirement() {
    }
    public void updateEntity(CustomerRequirement newCustomerRequirement){
        this.company = newCustomerRequirement.company;
        this.contact = newCustomerRequirement.contact;
        this.representative = newCustomerRequirement.representative;
        this.furtherNotes = newCustomerRequirement.furtherNotes;
        this.internalNote = newCustomerRequirement.internalNote;

        super.updateEntity( (TechnologistAppointment) newCustomerRequirement);

        for(CustomerVisit visit : newCustomerRequirement.customerVisits){
            if(visit.id == null || visit.id == 0){
                visit.id = null;
                visit.persist();
                this.customerVisits.add(visit);

                if(visit.finalReport != null){
                    visit.finalReport.id = null;
                    visit.finalReport.persist();
                }
            }else {
                customerVisits.stream().filter(v -> v.id.equals(visit.id)).findFirst().ifPresentOrElse(
                        v -> v.updateEntity(visit),
                        () -> System.out.println("not found")
                );
            }
        }

    }

}
