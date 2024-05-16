package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

@Entity
public class Technologist extends PanacheEntity {

    public String firstName;
    public String lastName;
    public boolean active;

    public Technologist(String firstName, String lastName, boolean active) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.active = active;
    }

    public Technologist() {
    }

    public void update(Technologist technologist) {
        this.firstName = technologist.firstName;
        this.lastName = technologist.lastName;
        this.active = technologist.active;

    }
}
