package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

import java.util.Date;

@Entity
public class FlightBooking extends PanacheEntity {

    public Date flightDate;
    public String flightFrom;
    public String flightTo;

    public void update(FlightBooking newEntity){
        this.flightDate = newEntity.flightDate;
        this.flightFrom = newEntity.flightFrom;
        this.flightTo = newEntity.flightTo;
    }

    public FlightBooking persistOrUpdate(){
        if(this.id != null && this.id != 0){
            FlightBooking persisted = FlightBooking.findById(this.id);
            persisted.update(this);
            return persisted;
        }

        this.persist();
        return this;
    }

}
