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

  constructor(private dialog: MatDialog, private http: HttpService, private route: ActivatedRoute) { }

  toha: Toechterhaeandler[] = [
    { value: 'Active-1', viewValue: 'Active' },
    { value: 'Active-2', viewValue: 'Active2' },
    { value: 'Tester-1', viewValue: 'Tester' },
  ];

  representative: {value: string, viewValue: string}[] = [
    {value:"Karl Reingruber", viewValue:"Karl Reingruber"},
    {value:"Karl Mösenbichler", viewValue:"Karl Mösenbichler"},
    {value:"Grazia Maria Perner", viewValue:"Grazia Maria Perner"},
    {value:"Reinhard Schatz", viewValue:"Reinhard Schatz"}
  ]

  inputCustomerRequirement: CustomerRequirement = {
    customerVisits: []
  };

  startEdit(id: number): void {
    this.editId = id;
  }

  stopEdit(): void {
    console.log(this.inputCustomerRequirement.customerVisits)
    this.editId = null;
  }

  addRow(): void {
    this.inputCustomerRequirement.customerVisits = [
      ...this.inputCustomerRequirement.customerVisits!,
      {
        editId: this.i++,
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
    this.inputCustomerRequirement.customerVisits! = this.inputCustomerRequirement.customerVisits!.filter(d => d.id !== id);
  }


  selChange(event: MatSelectChange, editId: number) {
    console.log(event)
    console.log(this.editId)

    var editVisit = this.inputCustomerRequirement.customerVisits!.find(o => o.editId === editId);
    if (editVisit != null || editVisit != undefined) {
      editVisit.presentationOfNewProducts = event.value.includes(1);
      editVisit.existingProducts = event.value.includes(2);
      editVisit.recipeOptimization = event.value.includes(3);
      editVisit.sampleProduction = event.value.includes(4);
      editVisit.training = event.value.includes(5);
    }
  }
  ngOnInit(): void {

    this.getTechnologist();

    this.route.paramMap.subscribe(params => {
      if(params.get('id') != null){
        this.http.getCustomerById(parseInt(params.get('id')!)).subscribe({
          next: data => {
            if(data != null){
              this.inputCustomerRequirement = data;

              this.inputCustomerRequirement.customerVisits.forEach((element, index) => {
                element.selection = [
                  (element.presentationOfNewProducts)?1:0,
                  (element.existingProducts)?2:0,
                  (element.recipeOptimization)?3:0,
                  (element.sampleProduction)?4:0,
                  (element.training)?5:0
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


  postCustomerRequirement(){
    this.http.postCustomerRequirement(this.inputCustomerRequirement).subscribe({
      next: data => {
        this.inputCustomerRequirement = data;
        
        data.customerVisits.forEach((element, index) => {
          element.selection = [
            (element.presentationOfNewProducts)?1:0,
            (element.existingProducts)?2:0,
            (element.recipeOptimization)?3:0,
            (element.sampleProduction)?4:0,
            (element.training)?5:0
          ];
          element.editId = index;
        });

      },
      error: err => {
        console.log(err);
      }
    });
  }

  openDialog(customerVisit: CustomerVisit) {
    var finalReport: FinalReport = {}
    if(customerVisit.finalReport === null || customerVisit.finalReport === undefined || customerVisit.finalReport.id === 0){
      finalReport = {
        technologist: this.inputCustomerRequirement.requestedTechnologist!.firstName + " " + this.inputCustomerRequirement.requestedTechnologist!.lastName,
        company: customerVisit.companyName,
        companyNr: customerVisit.customerNr,
        representative: this.inputCustomerRequirement.representative,
        dateOfVisit: customerVisit.dateOfVisit,
        reason: [
          (customerVisit.presentationOfNewProducts)?1:0,
          (customerVisit.existingProducts)?2:0,
          (customerVisit.recipeOptimization)?3:0,
          (customerVisit.sampleProduction)?4:0,
          (customerVisit.training)?5:0,
          ]
      }
    }else{
      if(customerVisit.finalReport != undefined){
        finalReport = customerVisit.finalReport!
      }
    }

    const dialogRef = this.dialog.open(AbschlussBerichtComponent, {
      height: '50rem',
      width: '90rem',
      data: finalReport
    });

    dialogRef.afterClosed().subscribe(
      data => {
        if(data.save){
          customerVisit.finalReport = data.finalReport;
          this.postCustomerRequirement();
        }
      });
  }

  getTechnologist(){
    this.http.getActiveTechnologist().subscribe({
      next: data => {
        this.technologists = data;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  changeTechnolgist($event: any) {
    this.inputCustomerRequirement.requestedTechnologist = this.technologists.find(elemnt => elemnt.id === $event);
    console.log(this.inputCustomerRequirement);
    
  }

}

interface Toechterhaeandler {
  value: string;
  viewValue: string;
}
