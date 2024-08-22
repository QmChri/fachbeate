package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import java.util.Date;

@Entity
public class Support extends PanacheEntity {
    public String applicant;
    public Date time;
    public String of;
    @Column(columnDefinition = "TEXT")
    public String userText;
    @Column(columnDefinition = "TEXT")
    public String errorMessageConsole;

    public Support() {}

    public Support persistOrUpdate(){
        this.id = null;
        this.persist();
        return this;
    }
}
