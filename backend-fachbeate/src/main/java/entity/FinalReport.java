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

    public boolean presentationOfNewProducts;
    public boolean existingProducts;
    public boolean recipeOptimization;
    public boolean sampleProduction;
    public boolean training;
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

    public boolean reworkFollowVisits;
    public boolean reworkInformation;
    public boolean reworkRecipe_optimization;
    public boolean reworkProduct_development;

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

        this.reworkFollowVisits = newFinalReport.reworkFollowVisits;
        this.reworkInformation = newFinalReport.reworkInformation;
        this.reworkRecipe_optimization = newFinalReport.reworkRecipe_optimization;
        this.reworkProduct_development = newFinalReport.reworkProduct_development;

        this.customerContactDate = newFinalReport.customerContactDate;
        this.responseCustomer = newFinalReport.responseCustomer;
        this.furtherActivities = newFinalReport.furtherActivities;
        this.doneUntil = newFinalReport.doneUntil;
        this.interestingProducts = newFinalReport.interestingProducts;
        this.requestCompleted = newFinalReport.requestCompleted;
        this.summaryFinalReport = newFinalReport.summaryFinalReport;

        this.presentationOfNewProducts = newFinalReport.presentationOfNewProducts;
        this.existingProducts = newFinalReport.existingProducts;
        this.recipeOptimization = newFinalReport.recipeOptimization;
        this.sampleProduction = newFinalReport.sampleProduction;
        this.training = newFinalReport.training;

        this.reasonReports = new ArrayList<>();
        for(ReasonReport r: newFinalReport.reasonReports){
            reasonReports.add(r.persistOrUpdate());
        }

        if(newFinalReport.technologist != null) {
            this.technologist = newFinalReport.technologist.persistOrUpdate();
        }
        if(newFinalReport.representative != null) {
            this.representative = newFinalReport.representative.persistOrUpdate();
        }

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
