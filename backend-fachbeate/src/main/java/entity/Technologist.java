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

    public void updateEntity(Technologist technologist) {
        this.firstName = technologist.firstName;
        this.lastName = technologist.lastName;
        this.active = technologist.active;
        this.color = technologist.color;
    }

    public Technologist persistOrUpdate(){
        if(this.id != null && this.id != 0) {
            Technologist persisted = Technologist.findById(this.id);
            persisted.updateEntity(this);
            return persisted;
        }

        this.persist();
        return this;
    }
}
