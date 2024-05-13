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

    public CustomerVisit() {
    }
}
