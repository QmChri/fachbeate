package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.*;

@Entity
public class ReasonReport extends PanacheEntity {
    public int reason;
    public String carriedOutActivity;

    @ManyToMany
    public List<Article> presentedArticle;


    @Transactional(Transactional.TxType.REQUIRED)
    public void updateEntity(ReasonReport newEntity) {
        this.reason = newEntity.reason;
        this.carriedOutActivity = newEntity.carriedOutActivity;

        this.presentedArticle = new ArrayList<>();
        for(Article a : newEntity.presentedArticle){
            this.presentedArticle.add(a.persistOrUpdate());
        }

    }

    @Transactional(Transactional.TxType.REQUIRED)
    public ReasonReport persistOrUpdate(){
        if(this.id == null || this.id == 0) {
            this.id = null;
            this.persist();

            for(Article a : this.presentedArticle){
                a = a.persistOrUpdate();
            }

            return this;
        }else{
            ReasonReport reasonReport = ReasonReport.findById(this.id);
            reasonReport.updateEntity(this);
            return reasonReport;
        }
    }
}
