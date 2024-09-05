package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.transaction.Transactional;

import java.util.Date;

@Entity
public class HotelBooking extends PanacheEntity {

    public String hotelLocation;
    public Date hotelStayFromDate;
    public Date hotelStayToDate;
    public int singleRooms;
    public int doubleRooms;
    public boolean selfPay;

    public void update(HotelBooking newEntity){
        this.hotelLocation = newEntity.hotelLocation;
        this.hotelStayFromDate = newEntity.hotelStayFromDate;
        this.hotelStayToDate = newEntity.hotelStayToDate;
        this.singleRooms = newEntity.singleRooms;
        this.doubleRooms = newEntity.doubleRooms;
        this.selfPay = newEntity.selfPay;
    }

    @Transactional
    public HotelBooking persistOrUpdate(){
        if(this.id != null && this.id != 0){
            HotelBooking persisted = HotelBooking.findById(this.id);
            persisted.update(this);
            return persisted;
        }
        this.id = null;
        this.persist();
        return this;
    }
}
