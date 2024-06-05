package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

@Entity
public class Representative extends PanacheEntity {
    public String firstName;
    public String lastName;

    public boolean active;

    public void updateEntity(Representative newRepresentative){
        this.firstName = newRepresentative.firstName;
        this.lastName = newRepresentative.lastName;
        this.active = newRepresentative.active;
    }

    public Representative() {
    }

}
