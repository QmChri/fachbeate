package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

import java.util.Date;

@Entity
public class AdvancedFlightBooking extends PanacheEntity {

    public Date flightDate;
    public String flightFrom;
    public String alternativeFlightFrom;
    public String flightTo;
    public String alternativeFlightTo;
    public String preferredTime;
    public int luggageCount;
    public String luggageWeight;
    public String otherNotes;

    public void update(AdvancedFlightBooking newEntity){
        this.flightDate = newEntity.flightDate;
        this.flightFrom = newEntity.flightFrom;
        this.alternativeFlightFrom = newEntity.alternativeFlightFrom;
        this.flightTo = newEntity.flightTo;
        this.alternativeFlightTo = newEntity.alternativeFlightTo;
        this.preferredTime = newEntity.preferredTime;
        this.luggageCount = newEntity.luggageCount;
        this.luggageWeight = newEntity.luggageWeight;
        this.otherNotes = newEntity.otherNotes;
    }

    public AdvancedFlightBooking persistOrUpdate(){
        if(this.id != null && this.id != 0){
            AdvancedFlightBooking persisted = AdvancedFlightBooking.findById(this.id);
            persisted.update(this);
            return persisted;
        }

        this.persist();
        return this;
    }

}
