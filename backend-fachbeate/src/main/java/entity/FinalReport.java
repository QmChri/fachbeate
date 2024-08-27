package entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import entity.dto.FileDtos;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.*;

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
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

    @OneToMany
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
    @Transient
    public List<FileDtos> files;

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

    public FinalReport persistOrUpdate(){
        if(this.id == null || this.id == 0) {
            this.id = null;

            for (ReasonReport reasonReport : this.reasonReports) {
                reasonReport.persistOrUpdate();
            }

            this.persist();
            return this;
        }else{
            FinalReport finalReport = FinalReport.findById(this.id);
            finalReport.updateEntity(this);
            return finalReport;
        }
    }

    public FinalReport addFile() {

        this.files = new ArrayList<>();

        File uploadDir = new File("uploads/" + this.id);

        if(uploadDir.exists() && uploadDir.isDirectory()) {
            try {
                Files.list(uploadDir.toPath())
                        .filter(Files::isRegularFile) // Only process regular files
                        .forEach(filePath -> {
                            try {
                                byte[] fileBytes = Files.readAllBytes(filePath);
                                String content = Base64.getEncoder().encodeToString(fileBytes);

                                String fileName = filePath.getFileName().toString();
                                files.add(new FileDtos(fileName, content));
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        });


            } catch (IOException e) {
                return this;
            }
        }
        return this;
    }

}
