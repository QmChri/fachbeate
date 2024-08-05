package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

import java.util.Date;

@Entity
public class MeetingRoomReservation extends PanacheEntity {

    public String meetingRoomLocation;
    public Date meetingRoomDate;
    public String meetingRoomTime;

    public void update(MeetingRoomReservation newEntity){
        this.meetingRoomLocation = newEntity.meetingRoomLocation;
        this.meetingRoomDate = newEntity.meetingRoomDate;
        this.meetingRoomTime = newEntity.meetingRoomTime;
    }

    public MeetingRoomReservation persistOrUpdate(){
        if(this.id != null && this.id != 0){
            MeetingRoomReservation persisted = MeetingRoomReservation.findById(this.id);
            persisted.update(this);
            return persisted;
        }

        this.persist();
        return this;
    }

}
