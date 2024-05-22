package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

import java.time.LocalDate;
import java.util.List;

@Entity
public class FinalReport extends PanacheEntity {
    public String technologist;
    public String company;
    public LocalDate dateOfVisit;
    public List<Integer> reason;
    public String customerFeedback;
    public String nextSteps;
    public String nextStepsTechnologist;
    public String nextStepsUntil;
    public String furtherInformation;

    public FinalReport() {
    }
    public void updateEntity(FinalReport newFinalReport) {
        this.technologist = newFinalReport.technologist;
        this.company = newFinalReport.company;
        this.dateOfVisit = newFinalReport.dateOfVisit;
        this.reason = newFinalReport.reason;
        this.customerFeedback = newFinalReport.customerFeedback;
        this.nextSteps = newFinalReport.nextSteps;
        this.nextStepsTechnologist = newFinalReport.nextStepsTechnologist;
        this.nextStepsUntil = newFinalReport.nextStepsUntil;
        this.furtherInformation = newFinalReport.furtherInformation;
    }
}
