package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

@Entity
public class Technologist extends PanacheEntity {

    public String firstName;
    public String lastName;

    public String color;

    public boolean active;


    public Technologist() {
    }

    public void update(Technologist technologist) {
        this.firstName = technologist.firstName;
        this.lastName = technologist.lastName;
        this.active = technologist.active;
        this.color = technologist.color;
    }
}
