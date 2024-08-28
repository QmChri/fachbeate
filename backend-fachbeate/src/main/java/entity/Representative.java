package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
public class Representative extends PanacheEntity {
    public String firstName;
    public String lastName;
    public String email;

    public boolean active;

    @OneToMany(fetch = FetchType.EAGER)
    public List<Technologist> groupMembersTechnologists = new ArrayList<>();

    @OneToMany(fetch = FetchType.EAGER)
    public List<Representative> groupMembersRepresentatives = new ArrayList<>();

    public void updateEntity(Representative newRepresentative){
        this.firstName = newRepresentative.firstName;
        this.lastName = newRepresentative.lastName;
        this.active = newRepresentative.active;
        this.email = newRepresentative.email;

        this.groupMembersTechnologists = new ArrayList<>();
        for (Technologist techno : newRepresentative.groupMembersTechnologists) {
            this.groupMembersTechnologists.add(techno.persistOrUpdate());
        }

        this.groupMembersRepresentatives = new ArrayList<>();
        for (Representative representative : newRepresentative.groupMembersRepresentatives) {
            this.groupMembersRepresentatives.add(representative.persistOrUpdate());
        }
    }

    public Representative persistOrUpdate(){
        if(this.id == null || this.id == 0){
            this.id = null;
            for (Representative representative : this.groupMembersRepresentatives) {
                if (!Objects.equals(this.id, representative.id)) {
                    representative = representative.persistOrUpdate();
                }
            }
            for (Technologist technologist : this.groupMembersTechnologists) {
                technologist = technologist.persistOrUpdate();
            }

            this.persist();
            return this;
        }
        Representative representative = Representative.findById(this.id);
        representative.updateEntity(this);
        return representative;
    }

    public Representative() {
    }

}
