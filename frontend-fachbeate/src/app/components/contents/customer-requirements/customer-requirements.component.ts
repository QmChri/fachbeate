import { Component, OnInit, input } from '@angular/core';
import { CustomerRequirement } from '../../../models/customer-requirement';
import { MatSelectChange } from '@angular/material/select';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AbschlussBerichtComponent } from '../abschluss-bericht/abschluss-bericht.component';
import { HttpService } from '../../../services/http.service';
import { Technologist } from '../../../models/technologist';
import { FinalReport } from '../../../models/final-report';
import { CustomerVisit } from '../../../models/customer-visit';
import { ActivatedRoute } from '@angular/router';
import { ReasonReport } from '../../../models/reason-report';
import { Representative } from '../../../models/representative';
import { Company } from '../../../models/company';
import { NotificationService } from '../../../services/notification.service';
import { RoleService } from '../../../services/role.service';
import { TranslateService } from '@ngx-translate/core';

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
  technologists: Technologist[] = [];
  representative: Representative[] = [];
  companies: Company[] = [];
  freigegeben: boolean = true;
  dateFormat = 'dd.MM.yy';

  constructor(public translate: TranslateService, private dialog: MatDialog, private http: HttpService, private route: ActivatedRoute, private notificationService: NotificationService, public roleService: RoleService) { }

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
            console.log(err);
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
    }
    else if (department === 'al' && this.checkRequired()) {
      this.getNotification(3);
      this.inputCustomerRequirement.releaseSupervisor = new Date();
      this.inputCustomerRequirement.releaserSupervisor = this.roleService.getUserName()
      this.postCustomerRequirement();
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
    console.log(this.inputCustomerRequirement.customerVisits);

    if (this.checkRequired()) {
      this.getNotification(1);
      this.inputCustomerRequirement.showUser = true;
      this.inputCustomerRequirement.dateOfCreation = new Date();

      if (this.inputCustomerRequirement.startDate !== null && this.inputCustomerRequirement.startDate !== undefined) {
        if (typeof this.inputCustomerRequirement.startDate === 'string' || typeof this.inputCustomerRequirement.startDate === 'number') {
          this.inputCustomerRequirement.startDate = new Date(this.inputCustomerRequirement.startDate);
        }
        if (this.inputCustomerRequirement.startDate instanceof Date) {
          this.inputCustomerRequirement.startDate.setHours(5);
        } else {
          console.log("startDate is not a valid Date object");
        }
      } else {
        console.log("startDate is not defined");
      }

      if (this.inputCustomerRequirement.endDate !== null && this.inputCustomerRequirement.endDate !== undefined) {
        if (typeof this.inputCustomerRequirement.endDate === 'string' || typeof this.inputCustomerRequirement.endDate === 'number') {
          this.inputCustomerRequirement.endDate = new Date(this.inputCustomerRequirement.endDate);
        }
        if (this.inputCustomerRequirement.endDate instanceof Date) {
          this.inputCustomerRequirement.endDate.setHours(5);
        } else {
          console.log("endDate is not a valid Date object");
        }
      } else {
        console.log("endDate is not defined");
      }

      this.inputCustomerRequirement.customerVisits.forEach(element => {
        element.fromDateOfVisit = element.dateSelect![0];
        element.toDateOfVisit = element.dateSelect![1];
      });


      if (this.inputCustomerRequirement.creator === undefined) {
        this.inputCustomerRequirement.creator = this.roleService.getUserName();
      }
      this.inputCustomerRequirement.lastEditor = this.roleService.getUserName(); this.http.postCustomerRequirement(this.inputCustomerRequirement).subscribe({
        next: data => {
          this.inputCustomerRequirement = data;
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
          console.log(err);
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
      (this.inputCustomerRequirement.customerVisits.filter(element => element.dateSelect!.length !== 2).length !== 0) ? "assigned_dateOfVisit" : "",
      (this.inputCustomerRequirement.customerVisits.filter(element => element.presentationOfNewProducts === false && element.existingProducts === false && element.recipeOptimization === false && element.sampleProduction === false && element.training === false).length !== 0) ? "assigned_reason" : "",
      (this.inputCustomerRequirement.customerVisits.filter(element => element.productionAmount === null || element.productionAmount === undefined || element.productionAmount === "").length !== 0) ? "assigned_productionAmount" : ""
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
        data => {
          if (data.save) {
            customerVisit.finalReport = data.finalReport;
            this.freigegeben = false;
            this.postCustomerRequirement();
            this.getNotification(5);
          }
        });
    }
  }

  getTechnologist() {
    this.http.getActiveTechnologist().subscribe({
      next: data => {
        this.technologists = data;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  getRepresentative() {
    this.http.getActiveRepresentative().subscribe({
      next: data => {
        this.representative = data;
      },
      error: err => {
        console.log(err);
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
        console.log(err);
      }
    });
  }

  //region Function when something changes in the selects
  changeTechnolgist($event: any) {
    this.inputCustomerRequirement.requestedTechnologist = this.technologists.find(elemnt => elemnt.id === $event);
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
      case 6: { // Final Report aber PFlichfelder fehlen
        this.translate.get('STANDARD.please_fill_required_fields').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(4, translatedMessage, '', 'topRight');
        }); break;
      }
    }
  }
}

interface Toechterhaeandler {
  value: string;
  viewValue: string;
}
