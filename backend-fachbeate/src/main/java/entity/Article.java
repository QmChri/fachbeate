package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.transaction.Transactional;

import java.util.List;

@Entity
public class Article extends PanacheEntity {

    public String name;
    public String articleNr;

    public Article() {
    }

    public void update(Article newEntity){
        this.articleNr = newEntity.articleNr;
        this.name = newEntity.name;
    }

    public Article persistOrUpdate(){
        if(this.id != null && this.id != 0){
            Article persisted = Article.findById(this.id);
            persisted.update(this);
            return persisted;
        }

        Article nrArticle = Article.find("articleNr", this.articleNr).firstResult();
        if(nrArticle == null){
            this.id = null;
            this.persist();
            return this;
        }
        nrArticle.update(this);
        return nrArticle;
    }

}
