package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.Date;
import java.util.Map;
import java.util.Random;

@Entity
public class ReasonReport extends PanacheEntity {
    public int reason;
    public String carriedOutActivity;

    public String presentedArticle;
    public boolean reworkByTechnologist;
    public Date reworkByTechnologistDoneUntil;
    public boolean state;

    public boolean reworkByRepresentative;
    public Date reworkByRepresentativeDoneUntil;

    @Transactional(Transactional.TxType.REQUIRED)
    public void updateEntity(ReasonReport newEntity) {
        this.reason = newEntity.reason;
        this.carriedOutActivity = newEntity.carriedOutActivity;
        //this.presentedArticle = newEntity.presentedArticle;
        this.reworkByTechnologist = newEntity.reworkByTechnologist;
        this.reworkByTechnologistDoneUntil = newEntity.reworkByTechnologistDoneUntil;
        this.state = newEntity.state;
        this.reworkByRepresentative = newEntity.reworkByRepresentative;
        this.reworkByRepresentativeDoneUntil = newEntity.reworkByRepresentativeDoneUntil;
    }

    @Transactional(Transactional.TxType.REQUIRED)

    public ReasonReport persistOrUpdate(){
        if(this.id == null || this.id == 0) {
            this.id = null;
            this.persist();

            return this;
        }else{
            ReasonReport reasonReport = ReasonReport.findById(this.id);
            reasonReport.updateEntity(this);
            return reasonReport;
        }
    }
}
