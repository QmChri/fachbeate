package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

@Entity
public class Customer extends PanacheEntity {

    String name;
    String location;


    //region Constructor
    public Customer(String name, String location) {
        this.name = name;
        this.location = location;
    }

    public Customer() {
    }
    //endregion


}
