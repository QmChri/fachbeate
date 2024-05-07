package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

import java.time.LocalDate;

@Entity
public class CustomerVisit extends PanacheEntity {

    String companyName;
    String address;
    String contactPerson;
    LocalDate dateOfVisit;
    String ProductionAmount;
    boolean presentationOfNewProducts;
    boolean existingProducts;
    boolean recipeOptimization;
    boolean sampleProduction;
    boolean training;

    public CustomerVisit(String companyName, String address, String contactPerson, LocalDate dateOfVisit, String productionAmount, boolean presentationOfNewProducts, boolean existingProducts, boolean recipeOptimization, boolean sampleProduction, boolean training) {
        this.companyName = companyName;
        this.address = address;
        this.contactPerson = contactPerson;
        this.dateOfVisit = dateOfVisit;
        ProductionAmount = productionAmount;
        this.presentationOfNewProducts = presentationOfNewProducts;
        this.existingProducts = existingProducts;
        this.recipeOptimization = recipeOptimization;
        this.sampleProduction = sampleProduction;
        this.training = training;
    }

    public CustomerVisit() {
    }
}
