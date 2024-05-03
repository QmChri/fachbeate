package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

import java.time.LocalDate;

@Entity
public class Appointment extends PanacheEntity {

    LocalDate startDate;
    LocalDate endDate;

    Consultant consultant;
    Customer customer;


    //region Constructor
    public Appointment(LocalDate startDate, LocalDate endDate, Consultant consultant) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.consultant = consultant;
    }

    public Appointment() {
    }
    //endregion


}
