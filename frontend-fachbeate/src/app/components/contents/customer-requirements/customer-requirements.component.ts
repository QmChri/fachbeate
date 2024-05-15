import { Component, OnInit } from '@angular/core';
import { CustomerRequirement } from '../../../models/customer-requirement';
import { MatSelectChange } from '@angular/material/select';
import { FormControl, Validators } from '@angular/forms';

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

  toha: Toechterhaeandler[] = [
    { value: 'Active-1', viewValue: 'Active' },
    { value: 'Active-2', viewValue: 'Active2' },
    { value: 'Tester-1', viewValue: 'Tester' },
  ];

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
        id: this.i++,
        companyName: '',
        address: '',
        contactPerson: '',
        dateOfVisit: undefined,
        presentationOfNewProducts: false,
        existingProducts: false,
        recipeOptimization: false,
        sampleProduction: false,
        training: false
      }
    ];
    this.editId = this.i;
  }

  deleteRow(id: number): void {
    this.inputCustomerRequirement.customerVisits! = this.inputCustomerRequirement.customerVisits!.filter(d => d.id !== id);
  }


  selChange(event: MatSelectChange, id: number) {
    console.log(event)
    console.log(this.editId)

    var editVisit = this.inputCustomerRequirement.customerVisits!.find(o => o.id === id);
    if (editVisit != null || editVisit != undefined) {
      editVisit.presentationOfNewProducts = event.value.includes('1');
      editVisit.existingProducts = event.value.includes('2');
      editVisit.recipeOptimization = event.value.includes('3');
      editVisit.sampleProduction = event.value.includes('4');
      editVisit.training = event.value.includes('5');
    }
  }
  ngOnInit(): void {
  }
}

interface Toechterhaeandler {
  value: string;
  viewValue: string;
}
