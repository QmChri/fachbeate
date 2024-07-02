package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
public class FinalReport extends PanacheEntity {
    public String state;

    public String creator;
    public boolean technologistEntered;
    public boolean representativeEntered;
    public String lastEditor;


    @ManyToOne
    public Technologist technologist;
    @ManyToOne
    public Representative representative;
    public Date dateOfVisit;
    public String company;
    public String companyNr;

    @OneToMany( fetch = FetchType.EAGER)
    public List<ReasonReport> reasonReports;
    public Date customerContactDate;
    public String responseCustomer;
    public boolean furtherActivities;
    public Date doneUntil;
    public String interestingProducts;
    public boolean requestCompleted;
    public String summaryFinalReport;

    public boolean reworkByTechnologist;
    public Date reworkByTechnologistDoneUntil;
    public String reworkByTechnologistState;

    public boolean reworkByRepresentative;
    public Date reworkByRepresentativeDoneUntil;


    public FinalReport() {
    }

    @Transactional(Transactional.TxType.REQUIRED)
    public void updateEntity(FinalReport newFinalReport) {
        this.creator = newFinalReport.creator;
        this.lastEditor = newFinalReport.lastEditor;

        this.technologistEntered = newFinalReport.technologistEntered;
        this.representativeEntered = newFinalReport.representativeEntered;


        this.state = newFinalReport.state;
        this.dateOfVisit = newFinalReport.dateOfVisit;
        this.company = newFinalReport.company;
        this.companyNr = newFinalReport.companyNr;

        this.reworkByTechnologist = newFinalReport.reworkByTechnologist;
        this.reworkByTechnologistDoneUntil = newFinalReport.reworkByTechnologistDoneUntil;
        this.reworkByTechnologistState = newFinalReport.reworkByTechnologistState;
        this.reworkByRepresentative = newFinalReport.reworkByRepresentative;
        this.reworkByRepresentativeDoneUntil = newFinalReport.reworkByRepresentativeDoneUntil;

        this.customerContactDate = newFinalReport.customerContactDate;
        this.responseCustomer = newFinalReport.responseCustomer;
        this.furtherActivities = newFinalReport.furtherActivities;
        this.doneUntil = newFinalReport.doneUntil;
        this.interestingProducts = newFinalReport.interestingProducts;
        this.requestCompleted = newFinalReport.requestCompleted;
        this.summaryFinalReport = newFinalReport.summaryFinalReport;


        this.reasonReports = new ArrayList<>();
        for(ReasonReport r: newFinalReport.reasonReports){
            reasonReports.add(r.persistOrUpdate());
        }


        this.technologist = newFinalReport.technologist.persistOrUpdate();
        this.representative = newFinalReport.representative.persistOrUpdate();

    }

    @Transactional(Transactional.TxType.REQUIRED)
    public FinalReport persistOrUpdate(){
        if(this.id == null || this.id == 0) {
            this.id = null;
            this.persist();

            for (ReasonReport reasonReport : this.reasonReports) {
                reasonReport.persistOrUpdate();
            }
            return this;
        }else{
            FinalReport finalReport = FinalReport.findById(this.id);
            finalReport.updateEntity(this);
            return finalReport;
        }
    }

}
