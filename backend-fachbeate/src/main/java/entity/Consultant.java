package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

@Entity
public class Consultant extends PanacheEntity {

    String firstName;
    String lastName;


    //region Constructor
    public Consultant(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public Consultant() {
    }
    //endregion
}
