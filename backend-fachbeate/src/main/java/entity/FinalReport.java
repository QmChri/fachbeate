package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
public class FinalReport extends PanacheEntity {
    public String state;
    public String technologist;
    public String representative;
    public Date dateOfVisit;
    public String company;
    public String companyNr;

    @OneToMany( fetch = FetchType.EAGER)
    public List<ReasonReport> reasonReports;
    public Date customerContactDate;
    public String responseCustomer;
    public String furtherActivities;
    public Date doneUntil;
    public String interestingProducts;
    public boolean requestCompleted;
    public String summaryFinalReport;


    public FinalReport() {
    }

    @Transactional(Transactional.TxType.REQUIRED)
    public void updateEntity(FinalReport newFinalReport) {
        this.state = newFinalReport.state;
        this.technologist = newFinalReport.technologist;
        this.representative = newFinalReport.representative;
        this.dateOfVisit = newFinalReport.dateOfVisit;
        this.company = newFinalReport.company;
        this.companyNr = newFinalReport.companyNr;

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
