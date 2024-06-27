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

  constructor(private translate: TranslateService, private dialog: MatDialog, private http: HttpService, private route: ActivatedRoute, private notificationService: NotificationService, public roleService: RoleService) { }

  ngOnInit(): void {
    this.getTechnologist();
    this.getRepresentative();
    this.getCompanies();

    this.route.paramMap.subscribe(params => {
      if (params.get('id') != null) {
        this.http.getCustomerById(parseInt(params.get('id')!)).subscribe({
          next: data => {
            if (data != null) {
              this.inputCustomerRequirement = data;

              this.inputCustomerRequirement.customerVisits.forEach((element, index) => {
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
      } else {
        this.addRow();
      }
    });
  }

  release(department: string) {

    if (department === 'gl' && this.checkRequired()) {
      this.translate.get(['STANDARD.approval_from_gl_granted', 'STANDARD.assigned_representative']).subscribe(translations => {
        const message = translations['STANDARD.approval_from_gl_granted'];
        const anotherMessage = translations['STANDARD.assigned_representative'];
        this.notificationService.createBasicNotification(4, message, anotherMessage, 'topRight');
      });
      this.translate.get('STANDARD.approval_from_gl_granted').subscribe((translatedMessage: string) => {
        this.notificationService.createBasicNotification(0, translatedMessage, '', 'topRight');
      });
      this.inputCustomerRequirement.releaseManagement = new Date();
      this.inputCustomerRequirement.releaserManagement = this.roleService.getUserName()
    }
    else if (department === 'al' && this.checkRequired()) {
      this.translate.get(['STANDARD.approval_from_al_granted', 'STANDARD.assigned_representative']).subscribe(translations => {
        const message = translations['STANDARD.approval_from_al_granted'];
        const anotherMessage = translations['STANDARD.assigned_representative'];
        this.notificationService.createBasicNotification(4, message, anotherMessage, 'topRight');
      }); this.inputCustomerRequirement.releaseSupervisor = new Date();
      this.inputCustomerRequirement.releaserSupervisor = this.roleService.getUserName()
    }
  }

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
    this.i = this.i + 1;

    this.inputCustomerRequirement.customerVisits = [
      ...this.inputCustomerRequirement.customerVisits!,
      {
        editId: this.i,
        companyName: '',
        address: '',
        contactPerson: '',
        dateOfVisit: undefined,
        presentationOfNewProducts: false,
        existingProducts: false,
        recipeOptimization: false,
        sampleProduction: false,
        training: false,
      }
    ];

    this.editId = this.i;
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
    if (this.checkRequired()) {
      this.translate.get(['STANDARD.form_sent', 'STANDARD.assigned_representative']).subscribe(translations => {
        const message = translations['STANDARD.please_fill_required_fields'];
        const anotherMessage = translations['STANDARD.assigned_representative'];
        this.notificationService.createBasicNotification(4, message, anotherMessage, 'topRight');
      });
      this.inputCustomerRequirement.reason = "XXXX"
      this.inputCustomerRequirement.dateOfCreation = new Date();

      if (this.inputCustomerRequirement.creator === undefined) {
        this.inputCustomerRequirement.creator = this.roleService.getUserName();
      }
      this.inputCustomerRequirement.lastEditor = this.roleService.getUserName(); this.http.postCustomerRequirement(this.inputCustomerRequirement).subscribe({
        next: data => {
          this.inputCustomerRequirement = data;

          data.customerVisits.forEach((element, index) => {
            element.selection = [
              (element.presentationOfNewProducts) ? 1 : 0,
              (element.existingProducts) ? 2 : 0,
              (element.recipeOptimization) ? 3 : 0,
              (element.sampleProduction) ? 4 : 0,
              (element.training) ? 5 : 0
            ];
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
    if (!this.inputCustomerRequirement.requestedTechnologist ||
      !this.inputCustomerRequirement.representative ||
      !this.inputCustomerRequirement.startDate ||
      !this.inputCustomerRequirement.endDate) {
        this.translate.get(['STANDARD.please_fill_required_fields', 'STANDARD.assigned_representative']).subscribe(translations => {
          const message = translations['STANDARD.please_fill_required_fields'];
          const anotherMessage = translations['STANDARD.assigned_representative'];
          this.notificationService.createBasicNotification(4, message, anotherMessage, 'topRight');
        });
         return false;
    }
    return true;
  }

  openDialog(customerVisit: CustomerVisit) {
    var finalReport: FinalReport = {}

    if (this.checkRequired()) {

      var rRepo: ReasonReport[] = [
        (customerVisit.presentationOfNewProducts) ? { reason: 1, presentedArticle: [] } : { reason: 0, presentedArticle: [] },
        (customerVisit.existingProducts) ? { reason: 2, presentedArticle: [] } : { reason: 0, presentedArticle: [] },
        (customerVisit.recipeOptimization) ? { reason: 3, presentedArticle: [] } : { reason: 0, presentedArticle: [] },
        (customerVisit.sampleProduction) ? { reason: 4, presentedArticle: [] } : { reason: 0, presentedArticle: [] },
        (customerVisit.training) ? { reason: 5, presentedArticle: [] } : { reason: 0, presentedArticle: [] }
      ].filter(element => element.reason !== 0);


      finalReport = {
        technologist: this.inputCustomerRequirement.requestedTechnologist!.firstName + " " + this.inputCustomerRequirement.requestedTechnologist!.lastName,
        company: customerVisit.companyName,
        companyNr: customerVisit.customerNr,
        representative: this.inputCustomerRequirement.representative!.firstName + " " + this.inputCustomerRequirement.representative!.lastName,
        dateOfVisit: customerVisit.dateOfVisit,
        reasonReports: rRepo
      }

      const dialogRef = this.dialog.open(AbschlussBerichtComponent, {
        height: '42.5rem',
        width: '80rem',
        data: finalReport
      });

      dialogRef.afterClosed().subscribe(
        data => {
          if (data.save) {
            customerVisit.finalReport = data.finalReport;
            this.postCustomerRequirement();
            this.translate.get('STANDARD.final_report_added').subscribe((translatedMessage: string) => {
              this.notificationService.createBasicNotification(0, translatedMessage, '', 'topRight');
            });
          }
        });
    } else {
      if (customerVisit.finalReport != undefined) {
        finalReport = customerVisit.finalReport!
      }
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
      },
      error: err => {
        console.log(err);
      }
    });
  }

  changeTechnolgist($event: any) {
    this.inputCustomerRequirement.requestedTechnologist = this.technologists.find(elemnt => elemnt.id === $event);
  }

  changeCompany($event: any) {
    this.inputCustomerRequirement.company = this.companies.find(elemnt => elemnt.id === $event);
  }

  changeRepresentative($event: any) {
    this.inputCustomerRequirement.representative = this.representative.find(elemnt => elemnt.id === $event);
  }
}

interface Toechterhaeandler {
  value: string;
  viewValue: string;
}
