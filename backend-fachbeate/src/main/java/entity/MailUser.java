package entity;

import entity.enums.Department;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

@Entity
public class MailUser extends PanacheEntity {

    public String firstName;
    public String lastName;
    public String userName;
    public String email;
    public Department department;

    public MailUser() {
    }

    public void updateEntity(MailUser mailUser) {
        this.firstName = mailUser.firstName;
        this.lastName = mailUser.lastName;
        this.userName = mailUser.userName;
        this.email = mailUser.email;
        this.department = mailUser.department;
    }

    public MailUser persistOrUpdate(){
        if(this.id != null && this.id != 0) {
            MailUser persisted = MailUser.findById(this.id);
            persisted.updateEntity(this);
            return persisted;
        }

        this.persist();
        return this;
    }
}