package entity;

import entity.enums.Function;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.inject.Inject;
import jakarta.persistence.Entity;

import java.util.logging.Logger;

public class MailUser extends PanacheEntity {


    public String id;
    public String firstName;
    public String lastName;
    public String userName;
    public String email;
    public Function function;
    public boolean active;


    public MailUser() {
    }

    public MailUser(String id,String firstName, String lastName, String userName, String email,Function function, boolean active) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userName = userName;
        this.email = email;
        this.active = active;
        this.function = function;
    }

}