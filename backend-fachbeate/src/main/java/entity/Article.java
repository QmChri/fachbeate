package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.persistence.Entity;
import jakarta.transaction.Transactional;

import java.util.List;

@Entity
public class Article extends PanacheEntity {

    public String name;
    public int articleNr;
    public String summary;

    public Article() {
    }

    public void update(Article newEntity){
        this.articleNr = newEntity.articleNr;
        this.name = newEntity.name;
        this.summary = newEntity.summary;
    }

    public Article persistOrUpdate(){
        if(this.id != null && this.id != 0){
            Article persisted = Article.findById(this.id);
            persisted.update(this);
            return persisted;
        }

        this.id = null;
        this.persist();
        return this;
    }

}
