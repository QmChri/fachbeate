package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

@Entity
public class Guest extends PanacheEntity {

    public int sex;
    public String firstName;
    public String lastName;
    public String function;

    public Guest() {
    }
    public Guest(int sex, String firstName, String lastName, String function) {
        this.sex = sex;
        this.firstName = firstName;
        this.lastName = lastName;
        this.function = function;
    }


    public void updateEntity(Guest guest) {
        this.firstName = guest.firstName;
        this.lastName = guest.lastName;
        this.sex = guest.sex;
        this.function = guest.function;
    }

    public Guest persistOrUpdate(){
        if(this.id != null && this.id != 0) {
            Guest persisted = Guest.findById(this.id);
            persisted.updateEntity(this);
            return persisted;
        }

        this.persist();
        return this;
    }

}
