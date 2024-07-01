package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

@Entity
public class Company extends PanacheEntity {
    public String name;

    public String username;

    public boolean active;


    public void updateEntity(Company newEntity){
        this.name = newEntity.name;
        this.username = newEntity.username;
        this.active = newEntity.active;
    }

    public Company persistOrUpdate(){
        if(this.id == null || this.id == 0){
            this.id = null;
            this.persist();
            return this;
        }

        Company active = Company.findById(this.id);
        active.updateEntity(this);
        return active;
    }

    public Company() {
    }
}
