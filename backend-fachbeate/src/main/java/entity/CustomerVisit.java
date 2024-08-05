package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.Date;

@Entity
public class CustomerVisit extends PanacheEntity {

    public String companyName;
    public String customerNr;
    public String address;
    public String contactPerson;

    public Date fromDateOfVisit;
    public Date toDateOfVisit;

    public String productionAmount;

    public boolean presentationOfNewProducts;
    public boolean existingProducts;
    public boolean recipeOptimization;
    public boolean sampleProduction;
    public boolean training;

    @OneToOne(fetch = FetchType.EAGER)
    public FinalReport finalReport;

    public CustomerVisit() {
    }

    @Transactional(Transactional.TxType.REQUIRED)
    public void updateEntity(CustomerVisit newCustomerVisit){
        this.companyName = newCustomerVisit.companyName;
        this.customerNr = newCustomerVisit.customerNr;
        this.address = newCustomerVisit.address;
        this.contactPerson = newCustomerVisit.contactPerson;
        this.fromDateOfVisit = newCustomerVisit.fromDateOfVisit;
        this.toDateOfVisit = newCustomerVisit.toDateOfVisit;
        this.presentationOfNewProducts = newCustomerVisit.presentationOfNewProducts;
        this.existingProducts = newCustomerVisit.existingProducts;
        this.recipeOptimization = newCustomerVisit.recipeOptimization;
        this.sampleProduction = newCustomerVisit.sampleProduction;
        this.training = newCustomerVisit.training;

        this.finalReport = (newCustomerVisit.finalReport != null)?newCustomerVisit.finalReport.persistOrUpdate():null;

    }

    @Transactional(Transactional.TxType.REQUIRED)
    public CustomerVisit persistOrUpdate(){
        if(this.id == null || this.id == 0) {
            this.id = null;

            if(this.finalReport != null){
                this.finalReport = this.finalReport.persistOrUpdate();
            }

            this.persist();
            return this;
        }else{
            CustomerVisit customerVisit = CustomerVisit.findById(this.id);
            customerVisit.updateEntity(this);
            return customerVisit;
        }
    }

}
