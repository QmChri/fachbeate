import { Component } from '@angular/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CustomerVisit } from '../../../models/customer-visit';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-requirements',
  standalone: true,
  imports: [MatSelectModule,FormsModule,CommonModule],
  templateUrl: './customer-requirements.component.html',
  styleUrl: './customer-requirements.component.scss'
})
export class CustomerRequirementsComponent {
  customerVisitList:  CustomerVisit[] = []  

  inputCustomer:  CustomerVisit = 
  {
    companyName: "",
    address: "",
    contactPerson: "",
    dateOfVisit: new Date(),
    productionAmount: "",
    presentationOfNewProducts: false,
    existingProducts: false,
    recipeOptimization: false,
    sampleProduction: false,
    training: false,
  }

  insert(){
    this.customerVisitList = [...this.customerVisitList, this.inputCustomer]
    console.log(this.customerVisitList)
  }

  selChange(event: MatSelectChange){
    this.inputCustomer.presentationOfNewProducts = event.value.includes('1');
    this.inputCustomer.existingProducts = event.value.includes('2');
    this.inputCustomer.recipeOptimization = event.value.includes('3');
    this.inputCustomer.sampleProduction = event.value.includes('4');
    this.inputCustomer.training = event.value.includes('5');
  }
}
