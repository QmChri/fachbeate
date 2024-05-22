package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;

import java.time.LocalDate;

@Entity
public class CustomerVisit extends PanacheEntity {

    public String companyName;
    public String customerNr;
    public String address;
    public String contactPerson;
    public LocalDate dateOfVisit;
    public String productionAmount;
    public boolean presentationOfNewProducts;
    public boolean existingProducts;
    public boolean recipeOptimization;
    public boolean sampleProduction;
    public boolean training;

    @OneToOne
    public FinalReport finalReport;

    public CustomerVisit() {
    }


    public void updateEntity(CustomerVisit newCustomerVisit){
        this.companyName = newCustomerVisit.companyName;
        this.customerNr = newCustomerVisit.customerNr;
        this.address = newCustomerVisit.address;
        this.contactPerson = newCustomerVisit.contactPerson;
        this.dateOfVisit = newCustomerVisit.dateOfVisit;
        this.presentationOfNewProducts = newCustomerVisit.presentationOfNewProducts;
        this.existingProducts = newCustomerVisit.existingProducts;
        this.recipeOptimization = newCustomerVisit.recipeOptimization;
        this.sampleProduction = newCustomerVisit.sampleProduction;
        this.training = newCustomerVisit.training;

        if(newCustomerVisit.finalReport != null && (newCustomerVisit.finalReport.id == null || newCustomerVisit.finalReport.id == 0)){
            newCustomerVisit.finalReport.persist();
            this.finalReport = newCustomerVisit.finalReport;
            return;
        }
        if(newCustomerVisit.finalReport != null) {
            finalReport.updateEntity(newCustomerVisit.finalReport);
        }

    }
}
