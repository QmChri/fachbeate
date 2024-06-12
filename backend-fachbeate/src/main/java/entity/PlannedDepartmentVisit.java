package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

import java.util.Date;

@Entity
public class PlannedDepartmentVisit extends PanacheEntity {
    public String department;
    public Date dateOfVisit;

    public void updateEntity(PlannedDepartmentVisit plannedDepartmentVisit) {
        this.department = plannedDepartmentVisit.department;
        this.dateOfVisit = plannedDepartmentVisit.dateOfVisit;
    }

    public PlannedDepartmentVisit persistOrUpdate(){
        if(this.id == null || this.id == 0) {
            this.id = null;
            this.persist();
            return this;
        }else{
            PlannedDepartmentVisit persisted = PlannedDepartmentVisit.findById(this.id);
            persisted.updateEntity(this);
            return persisted;
        }
    }

}
