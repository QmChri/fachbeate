package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.transaction.Transactional;

@Entity
public class Article extends PanacheEntity {

    public String name;
    public int articleNr;

    public Article() {
    }

    public void update(Article newEntity){
        this.articleNr = newEntity.articleNr;
        this.name = newEntity.name;
    }

    @Transactional(Transactional.TxType.REQUIRED)
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
