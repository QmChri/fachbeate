import { Component, OnInit, input } from '@angular/core';
import { CustomerRequirement } from '../../../models/customer-requirement';
import { MatSelectChange } from '@angular/material/select';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AbschlussBerichtComponent } from '../abschluss-bericht/abschluss-bericht.component';
import { HttpService } from '../../../services/http.service';
import { FinalReport } from '../../../models/final-report';
import { CustomerVisit } from '../../../models/customer-visit';
import { ActivatedRoute } from '@angular/router';
import { ReasonReport } from '../../../models/reason-report';
import { Representative } from '../../../models/representative';
import { Company } from '../../../models/company';
import { NotificationService } from '../../../services/notification.service';
import { RoleService } from '../../../services/role.service';
import { TranslateService } from '@ngx-translate/core';
import { TechDateDTO } from '../../../models/tech-date-dto';
import { log } from '../../../services/logger.service';

@Component({
  selector: 'app-customer-requirements',
  templateUrl: './customer-requirements.component.html',
  styleUrl: './customer-requirements.component.scss'
})
export class CustomerRequirementsComponent implements OnInit {
  i = 0;
  editId: number | null = null;
  tohaControl = new FormControl<Toechterhaeandler | null>(null, Validators.required);
  selectedValue?: string;
  technologists: TechDateDTO[] = [];
  representative: Representative[] = [];
  companies: Company[] = [];
  freigegeben: boolean = true;
  dateFormat = 'dd.MM.yy';

  constructor(public translate: TranslateService, private dialog: MatDialog, private http: HttpService, private route: ActivatedRoute, private notificationService: NotificationService, public roleService: RoleService) { }

  disableTechDate = (current: Date): boolean => {
    if (!this.inputCustomerRequirement.requestedTechnologist) {
      return true; // Keine Technologenanforderung, also alle Daten deaktivieren
    }

    const reqTechDate = this.technologists.find(
      element => this.inputCustomerRequirement.requestedTechnologist!.id === element.technologist.id
    );

    if (!reqTechDate) {
      return true; // Kein passender Technologe gefunden, daher alle Daten deaktivieren
    }
    // Überprüfen, ob das aktuelle Datum in einem der Zeiträume liegt
    const isDateValid = reqTechDate.appointments.some(
      element => this.isDateBetween(new Date(current?.setHours(7)), new Date(element[0].toString()), new Date(element[1].toString()))
    );

    return !isDateValid; // Datum deaktivieren, wenn es nicht gültig ist
  }

  isDateBetween(date: Date, startDate: Date, endDate: Date): boolean {
    return date > new Date(startDate?.setHours(5)) && date < new Date(endDate?.setHours(8));
  }

  disabledDate = (current: Date): boolean => {
    return (current && this.inputCustomerRequirement.startDate !== undefined && this.inputCustomerRequirement.endDate !== undefined) && (current < this.inputCustomerRequirement.startDate! || current > this.inputCustomerRequirement.endDate!);
  };

  ngOnInit(): void {
    this.getTechnologist();
    this.getRepresentative();
    this.getCompanies();

    this.route.paramMap.subscribe(params => {
      if (params.get('id') != null) {
        //region If the route contains an Id, the specific customerRequirement is picked out
        this.http.getCustomerById(parseInt(params.get('id')!)).subscribe({
          next: data => {
            if (data != null) {
              this.inputCustomerRequirement = data;

              this.inputCustomerRequirement.customerVisits.forEach((element, index) => {
                element.dateSelect = [
                  element.fromDateOfVisit!,
                  element.toDateOfVisit!
                ]

                element.selection = [
                  (element.presentationOfNewProducts) ? 1 : 0,
                  (element.existingProducts) ? 2 : 0,
                  (element.recipeOptimization) ? 3 : 0,
                  (element.sampleProduction) ? 4 : 0,
                  (element.training) ? 5 : 0
                ];

                element.editId = index;
                this.i = index;
              });
              this.i++;
            }
          },
          error: err => {
            log("customer-requirements: ", err)
          }
        });
        //endregion
      } else {
        // If not, a line is added in the customer visit
        this.addRow();
      }
    });
  }

  //region Set approvals from the head of department and management
  release(department: string) {
    if (department === 'gl' && this.checkRequired()) {
      this.getNotification(2);
      this.inputCustomerRequirement.releaseManagement = new Date();
      this.inputCustomerRequirement.releaserManagement = this.roleService.getUserName()
      this.postCustomerRequirement();

      this.http.sendMail(
        ["abteilungsleitung"],
        "F_" + this.inputCustomerRequirement.id,
        "Freigabe GL",
        "Im Request Tool wurde eine Fachberater Anforderung (Nr." + this.inputCustomerRequirement.id + ") eingegeben und seitens GL freigegeben - bitte um kontrolle und Freigabe durch AL."
      ).subscribe();
      this.getNotification(9)
    }
    else if (department === 'al' && this.checkRequired()) {
      this.getNotification(3);

      this.inputCustomerRequirement.releaseSupervisor = new Date();
      this.inputCustomerRequirement.releaserSupervisor = this.roleService.getUserName()
      this.postCustomerRequirement();

      this.http.sendMail(
        ["fachberater", "vertreter", "creator"],
        "F_" + this.inputCustomerRequirement.id,
        "Freigabe GL+AL",
        "Ihre Fachberater Anforderung (Nr." + this.inputCustomerRequirement.id + ") wurde erfolgreich freigegeben. Bitte prüfen Sie noch einmal ihre Anforderung, es ist möglich das Daten aus organisatorischen Gründen geändert wurden"
      ).subscribe();
      this.getNotification(10)
    }
  }

  //endregion

  inputCustomerRequirement: CustomerRequirement = {
    customerVisits: []
  };

  startEdit(id: number): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
  }

  addRow(): void {
    //region Adds a new customer visit
    this.i = this.i + 1;

    this.inputCustomerRequirement.customerVisits = [
      ...this.inputCustomerRequirement.customerVisits!,
      {
        editId: this.i,
        companyName: '',
        address: '',
        contactPerson: '',
        fromDateOfVisit: undefined,
        toDateOfVisit: undefined,
        presentationOfNewProducts: false,
        existingProducts: false,
        recipeOptimization: false,
        sampleProduction: false,
        training: false,
      }
    ];
    // Sets the added visit to edit
    this.editId = this.i;

    // endregion
  }

  deleteRow(id: number): void {
    this.inputCustomerRequirement.customerVisits! = this.inputCustomerRequirement.customerVisits!.filter(d => d.editId !== id);
  }

  selChange(event: MatSelectChange, editId: number) {
    var editVisit = this.inputCustomerRequirement.customerVisits!.find(o => o.editId === editId);
    if (editVisit != null || editVisit != undefined) {
      editVisit.presentationOfNewProducts = event.value.includes(1);
      editVisit.existingProducts = event.value.includes(2);
      editVisit.recipeOptimization = event.value.includes(3);
      editVisit.sampleProduction = event.value.includes(4);
      editVisit.training = event.value.includes(5);
    }
  }

  postCustomerRequirement() {
    var sendmail: boolean = false;
    if (this.checkRequired()) {
      this.inputCustomerRequirement.showUser = true;
      this.inputCustomerRequirement.dateOfCreation = new Date();

      this.adjustDates();

      this.inputCustomerRequirement.customerVisits.forEach(element => {
        element.fromDateOfVisit = element.dateSelect![0];
        element.toDateOfVisit = element.dateSelect![1];
      });

      if (this.inputCustomerRequirement.creator === undefined) {
        this.inputCustomerRequirement.creator = this.roleService.getUserName();
        sendmail = true;
      }
      this.inputCustomerRequirement.lastEditor = this.roleService.getUserName();
      
      this.http.postCustomerRequirement(this.inputCustomerRequirement).subscribe({
        next: data => {
          this.getNotification(1);
          this.inputCustomerRequirement = data;

          if(sendmail){
            this.http.sendMail(
              ["geschaeftsleitung"],
              "F_" + this.inputCustomerRequirement.id,
              "Eingabe FB Anforderung",
              "Im Request Tool wurde eine Fachberater Anforderung (Nr." + this.inputCustomerRequirement.id + ") eingegeben - bitte um Freigabe durch GL."
            ).subscribe();
            this.getNotification(11)
          }

          this.inputCustomerRequirement.customerVisits.forEach((element, index) => {
            element.selection = [
              (element.presentationOfNewProducts) ? 1 : 0,
              (element.existingProducts) ? 2 : 0,
              (element.recipeOptimization) ? 3 : 0,
              (element.sampleProduction) ? 4 : 0,
              (element.training) ? 5 : 0
            ];

            element.dateSelect = [
              element.fromDateOfVisit!,
              element.toDateOfVisit!,
            ].filter(element => element !== null && element !== undefined);

            element.editId = index;
          });
        },
        error: err => {
          log("customer-requirements: ", err)
        }
      });
    }
  }

  checkRequired(): boolean {
    var requiredFields: string[] = [
      (this.inputCustomerRequirement.requestedTechnologist === undefined) ? "assigned_technologist" : "",
      (this.inputCustomerRequirement.representative === undefined) ? "assigned_repre" : "",
      (this.inputCustomerRequirement.startDate === undefined) ? "assigned_from" : "",
      (this.inputCustomerRequirement.endDate === undefined) ? "assigned_to" : "",
      (this.inputCustomerRequirement.company === null || this.inputCustomerRequirement.company === undefined) ? "assigned_company" : "",
      (this.inputCustomerRequirement.customerVisits.filter(element => element.companyName === null || element.companyName === undefined || element.companyName === "").length !== 0) ? "assigned_customer" : "",
      (this.inputCustomerRequirement.customerVisits.filter(element => element.address === null || element.address === undefined || element.address === "").length !== 0) ? "assigned_address" : "",
      (this.inputCustomerRequirement.customerVisits.filter(element => (element.dateSelect !== undefined && element.dateSelect!.length !== 2)).length !== 0) ? "assigned_dateOfVisit" : "",
      (this.inputCustomerRequirement.customerVisits.filter(element => element.presentationOfNewProducts === false && element.existingProducts === false && element.recipeOptimization === false && element.sampleProduction === false && element.training === false).length !== 0) ? "assigned_reason" : "",
      (this.inputCustomerRequirement.customerVisits.filter(element => element.productionAmount === null || element.productionAmount === undefined || element.productionAmount === "").length !== 0) ? "assigned_productionAmount" : "",
      (this.inputCustomerRequirement.startDate !== undefined && this.inputCustomerRequirement.endDate !== undefined && this.inputCustomerRequirement.requestedTechnologist !== undefined) ?
        (this.isDateRangeValid(this.inputCustomerRequirement.startDate!, this.inputCustomerRequirement.endDate!, this.technologists.find(tech => tech.technologist.id === this.inputCustomerRequirement.requestedTechnologist!.id)!.appointments) === false) ? "assigned_date" : "" : ""
    ].filter(element => element !== "");

    if (requiredFields.length !== 0) {
      this.translate.get(['STANDARD.please_fill_required_fields', ...requiredFields.map(element => "STANDARD." + element)]).subscribe(translations => {
        const message = translations['STANDARD.please_fill_required_fields'];
        const anotherMessage = requiredFields.map(element => translations["STANDARD." + element]).toString();
        this.notificationService.createBasicNotification(4, message, anotherMessage, 'topRight');
      });
    }

    return requiredFields.length === 0;
  }

  isOverlapping(newFrom: Date, newTo: Date, existingFrom: Date, existingTo: Date): boolean {
    return newFrom < existingTo && newTo > existingFrom;
  }

  isDateRangeValid(newFrom: Date, newTo: Date, existingRanges: Date[][]): boolean {
    return !existingRanges.some(range => this.isOverlapping(newFrom, newTo, new Date(range[0].toString()), new Date(range[1].toString())));
  }

  openDialog(customerVisit: CustomerVisit) {
    var finalReport: FinalReport = {}

    if (this.checkRequired()) {

      if (customerVisit.finalReport === null || customerVisit.finalReport === undefined) {

        //region prepare for FinalReport popup
        var rRepo: ReasonReport[] = [
          (customerVisit.presentationOfNewProducts) ? { reason: 1, presentedArticle: [] } : { reason: 0, presentedArticle: [] },
          (customerVisit.existingProducts) ? { reason: 2, presentedArticle: [] } : { reason: 0, presentedArticle: [] },
          (customerVisit.recipeOptimization) ? { reason: 3, presentedArticle: [] } : { reason: 0, presentedArticle: [] },
          (customerVisit.sampleProduction) ? { reason: 4, presentedArticle: [] } : { reason: 0, presentedArticle: [] },
          (customerVisit.training) ? { reason: 5, presentedArticle: [] } : { reason: 0, presentedArticle: [] }
        ].filter(element => element.reason !== 0);

        finalReport = {
          technologist: this.inputCustomerRequirement.requestedTechnologist,
          company: customerVisit.companyName,
          companyNr: customerVisit.customerNr,
          representative: this.inputCustomerRequirement.representative,
          dateOfVisit: customerVisit.fromDateOfVisit,
          reasonReports: rRepo
        }

        finalReport.presentationOfNewProducts = customerVisit.presentationOfNewProducts;
        finalReport.existingProducts = customerVisit.existingProducts;
        finalReport.recipeOptimization = customerVisit.recipeOptimization;
        finalReport.sampleProduction = customerVisit.sampleProduction;
        finalReport.training = customerVisit.training;
        //endregion
      } else {
        finalReport = customerVisit.finalReport;
      }

      //opening Abschlussbericht Popup
      const dialogRef = this.dialog.open(AbschlussBerichtComponent, {
        width: '90%',
        maxWidth: '90vw',
        maxHeight: '90vh',
        data: finalReport
      });

      // When the popup is closed, the final report is saved
      dialogRef.afterClosed().subscribe(


        (data: { finalReport: FinalReport, save: boolean }) => {
          if (data.save) {
            
            customerVisit.finalReport = data.finalReport;

            this.postCustomerRequirement()

            this.freigegeben = false;
            this.getNotification(5);
          }
        });
    }
  }

  getTechnologist() {
    this.http.getActiveWithDates().subscribe({
      next: data => {
        this.technologists = data;
      },
      error: err => {
        log("customer-requirements: ", err)
      }
    });
  }

  getRepresentative() {
    this.http.getActiveRepresentative().subscribe({
      next: data => {
        this.representative = data;
      },
      error: err => {
        log("customer-requirements: ", err)
      }
    });
  }

  getCompanies() {
    this.http.getActiveCompany().subscribe({
      next: data => {
        this.companies = data;

        if (this.roleService.checkPermission([6])) {
          this.inputCustomerRequirement.company = this.companies.find(element => element.username === this.roleService.getUserName())!;
        }
      },
      error: err => {
        log("customer-requirements: ", err)
      }
    });
  }

  //region Function when something changes in the selects
  changeTechnolgist($event: any) {
    this.inputCustomerRequirement.requestedTechnologist = this.technologists.find(elemnt => elemnt.technologist.id === $event)!.technologist;
  }

  changeCompany($event: any) {
    this.inputCustomerRequirement.company = this.companies.find(elemnt => elemnt.id === $event);
  }

  changeRepresentative($event: any) {
    this.inputCustomerRequirement.representative = this.representative.find(elemnt => elemnt.id === $event);
  }

  getNotification(type: number) {
    switch (type) {
      case 1: { //Formular wurde gesendet
        if (this.freigegeben) {
          this.translate.get('STANDARD.form_sent').subscribe((translatedMessage: string) => {
            this.notificationService.createBasicNotification(0, translatedMessage, '', 'topRight');
          });
        }
        break;
      }
      case 2: { // Freigabe GL
        this.translate.get('STANDARD.approval_from_gl_granted').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(0, translatedMessage, '', 'topRight');
        });
        this.freigegeben = false;
        break;
      }
      case 3: { // Freigabe AL
        this.translate.get('STANDARD.approval_from_al_granted').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(0, translatedMessage, '', 'topRight');
        });
        this.freigegeben = false;
        break;
      }
      case 5: { // Final Report
        this.translate.get('STANDARD.final_report_added').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(0, translatedMessage, '', 'topRight');
        }); break;
      }
      case 6: { // Final Report aber Pflichfelder fehlen
        this.translate.get('STANDARD.please_fill_required_fields').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(4, translatedMessage, '', 'topRight');
        }); break;
      }
      case 7: { // Pdf wurde erstellt
        this.translate.get('STANDARD.pdf1').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(0, translatedMessage, "Fachberater_Anforderung_" + this.inputCustomerRequirement.id + ".pdf", 'topRight');
        }); break;
      }
      case 8: { // Pdf konnte nicht erstellt werden
        this.translate.get('STANDARD.pdf2').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(4, translatedMessage, "Fachberater_Anforderung_" + this.inputCustomerRequirement.id + ".pdf", 'topRight');
        }); break;
      }
      case 9: { // Freigabe GL
        this.translate.get(['MAIL.sended', 'MAIL.gl'])
          .subscribe((translations: { [key: string]: string }) => {
            const message1 = translations['MAIL.sended'];
            const message2 = translations['MAIL.gl'];
            this.notificationService.createBasicNotification(0, message1, message2, 'topRight');
          });
        break;
      }
      case 10: { // Freigabe AL
        this.translate.get(['MAIL.sended', 'MAIL.al'])
          .subscribe((translations: { [key: string]: string }) => {
            const message1 = translations['MAIL.sended'];
            const message2 = translations['MAIL.al'];
            this.notificationService.createBasicNotification(0, message1, message2, 'topRight');
          });
        break;
      }
      case 11: { // Eingabe Fachberater Anforderung
        this.translate.get(['MAIL.sended', 'MAIL.A_5'])
          .subscribe((translations: { [key: string]: string }) => {
            const message1 = translations['MAIL.sended'];
            const message2 = translations['MAIL.A_5'];
            this.notificationService.createBasicNotification(0, message1, message2, 'topRight');
          });
        break;
      }
    }
  }

  getPdf() {
    if (this.inputCustomerRequirement.id === null || this.inputCustomerRequirement.id === undefined) {
      this.getNotification(8)
    }
    else {
      this.downloadFile();
      this.getNotification(7)
    }
  }
  downloadFile() {
    this.http.getPdf(this.inputCustomerRequirement.id!).subscribe(
      (response: Blob) => {
        this.saveFile(response, "Fachberater_Anforderung_" + this.inputCustomerRequirement.id + ".pdf")
      });
  }
  private saveFile(data: Blob, filename: string): void {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  adjustDates() {
    this.inputCustomerRequirement.startDate = this.setHours(this.inputCustomerRequirement.startDate);
    this.inputCustomerRequirement.endDate = this.setHours(this.inputCustomerRequirement.endDate);
    this.inputCustomerRequirement.customerVisits!.forEach(element => { 
      element.toDateOfVisit = this.setHours(element.toDateOfVisit); 
      element.fromDateOfVisit = this.setHours(element.fromDateOfVisit); 
    });
  }
  setHours(date: any) {
    return (date !== null && date !== undefined) ? new Date(new Date(new Date(date.toString()).setHours(5))) : undefined;
  }
}

interface Toechterhaeandler {
  value: string;
  viewValue: string;
}
function error(error: any): void {
  throw new Error('Function not implemented.');
}

