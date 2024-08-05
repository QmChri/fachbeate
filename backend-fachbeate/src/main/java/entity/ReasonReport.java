package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import org.hibernate.annotations.Cascade;

import java.time.LocalDate;
import java.util.*;

@Entity
public class ReasonReport extends PanacheEntity {
    public int reason;

    @ManyToMany
    public List<Article> presentedArticle;


    @Transactional(Transactional.TxType.REQUIRED)
    public void updateEntity(ReasonReport newEntity) {
        this.reason = newEntity.reason;

        this.presentedArticle = new ArrayList<>();
        for(Article a : newEntity.presentedArticle){
            this.presentedArticle.add(a.persistOrUpdate());
        }

    }

    public ReasonReport persistOrUpdate(){
        if(this.id == null || this.id == 0) {
            this.id = null;
            for(Article a : this.presentedArticle){
                a = a.persistOrUpdate();
            }
            this.persist();
            return this;
        }else{
            ReasonReport reasonReport = ReasonReport.findById(this.id);
            reasonReport.updateEntity(this);
            return reasonReport;
        }
    }
}
