package entity.dto;

import entity.*;

import java.util.Date;

public class MainListDTO {

    public String id;
    public String name;
    public String dateOfCreation;
    public String customerOrCompany;
    public String statusGL;
    public String statusAL;
    public String representative;
    public String technologist;
    public String fromDate;
    public String toDate;
    public String customer;
    public String finalReport;
    public int type;
    public boolean visible;
    public String calendarColor;

    public MainListDTO mapCustomerToMainListDTO(CustomerRequirement element){
        this.id=  "F_" + element.id;
        this.name= element.company.name;
        this.dateOfCreation = (element.dateOfCreation != null) ? element.dateOfCreation.toString() : "";
        this.customerOrCompany= element.creator;
        this.statusGL= (element.releaseSupervisor!=null) ? "GL Freigegeben " : "GL Nicht-Freigegeben";
        this.statusAL= (element.releaseManagement!=null) ? "AL Freigegeben " : "AL Nicht-Freigegeben";
        this.technologist= element.requestedTechnologist.firstName + " " + element.requestedTechnologist.lastName;
        this.representative= element.representative.firstName + " " + element.representative.lastName;
        this.fromDate= element.startDate.toString();
        this.toDate= element.endDate.toString();
        this.customer= (!element.customerVisits.isEmpty()) ? element.customerVisits.get(0).companyName: "<Leer>";
        this.finalReport= element.customerVisits.stream().filter(e -> e.finalReport != null).toList().size()+ "/" + element.customerVisits.size();
        this.type= 1;
        this.visible= element.showUser;
        this.calendarColor=element.requestedTechnologist.color;

        return this;
    }

    public MainListDTO mapBookingToMainListDTO(BookingRequest element){
        this.id=  "R_" + element.id;
        this.name= element.employeeNameAndCompany;
        this.dateOfCreation = (element.dateOfCreation != null) ? element.dateOfCreation.toString() : "";
        this.customerOrCompany= element.creator;
        this.statusGL= (element.releaseSupervisor!=null) ? "GL Freigegeben " : "GL Nicht-Freigegeben";
        this.statusAL= (element.releaseManagement!=null) ? "AL Freigegeben " : "AL Nicht-Freigegeben";
        this.technologist= "<Leer>";
        this.representative= "<Leer>";
        this.fromDate= element.mainStartDate.toString();
        this.toDate= element.mainStartDate.toString();
        this.customer= "<Leer>";
        this.finalReport= "<Leer>";
        this.type= 3;
        this.visible= element.showUser;
        this.calendarColor= "#808080";

        return this;
    }

    public MainListDTO mapWorkshopToMainListDTO(WorkshopRequirement element){

        this.id=  "S_" + element.id;
        this.name= element.company.name;
        this.dateOfCreation = (element.dateOfCreation != null) ? element.dateOfCreation.toString() : "";
        this.customerOrCompany= element.creator;
        this.statusGL= (element.releaseSupervisor!=null) ? "GL Freigegeben " : "GL Nicht-Freigegeben";
        this.statusAL= (element.releaseManagement!=null) ? "AL Freigegeben " : "AL Nicht-Freigegeben";
        this.technologist= (element.requestedTechnologist != null&&!element.requestedTechnologist.isEmpty())?element.requestedTechnologist.stream()
                .map(tech -> tech.firstName + " " + tech.lastName).toList().toString().replace("[","").replace("]",""):
                "<Leer>";
        this.representative= element.representative.firstName + " " + element.representative.lastName;
        this.fromDate= element.startDate.toString();
        this.toDate= element.endDate.toString();
        this.customer= element.customer;
        this.finalReport= "<Leer>";
        this.type= 2;
        this.visible= element.showUser;
        this.calendarColor=(element.requestedTechnologist != null&&!element.requestedTechnologist.isEmpty())?element.requestedTechnologist.get(0).color:"#808080";


        return this;
    }

    public MainListDTO mapVisitToMainListDTO(VisitorRegistration element){

        this.id=  "B_" + element.id;
        this.name= element.name;
        this.dateOfCreation = (element.dateOfCreation != null)?element.dateOfCreation.toString():"<Leer>";
        this.customerOrCompany= element.creator;
        this.statusGL= (element.releaseSupervisor!=null) ? "GL Freigegeben " : "GL Nicht-Freigegeben";
        this.statusAL= (element.releaseManagement!=null) ? "AL Freigegeben " : "AL Nicht-Freigegeben";
        this.technologist= "<Leer>";
        this.representative= (element.representative != null)?element.representative.firstName + " " + element.representative.lastName:"<Leer>";
        this.fromDate= (element.fromDate!=null)?element.fromDate.toString():(element.stayFromDate!=null)?element.stayFromDate.toString():"<Leer>";
        this.toDate= (element.toDate!=null)?element.toDate.toString():(element.stayToDate!=null)?element.stayToDate.toString():"<Leer>";
        this.customer= (element.customerOrCompany != null)?element.customerOrCompany:"<Leer>";
        this.finalReport= "<Leer>";
        this.type= 0;
        this.visible= element.showUser;

        return this;
    }
}
