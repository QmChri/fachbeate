import { Component, OnInit } from '@angular/core';
import { CustomerVisit } from '../../../models/customer-visit';
import { MatSelectChange } from '@angular/material/select';


@Component({
  selector: 'app-customer-requirements',
  templateUrl: './customer-requirements.component.html',
  styleUrl: './customer-requirements.component.scss'
})
export class CustomerRequirementsComponent implements OnInit {
  i = 0;
  editId: number | null = null;
  listOfData: CustomerVisit[] = [];

  startEdit(id: number): void {
    this.editId = id;
  }

  stopEdit(): void {
    console.log(this.listOfData)
    this.editId = null;
  }

  addRow(): void {
    this.listOfData = [
      ...this.listOfData,
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
    this.listOfData = this.listOfData.filter(d => d.id !== id);
  }


  selChange(event: MatSelectChange, id: number) {
    console.log(event)
    console.log(this.editId)

    var editVisit = this.listOfData.find(o => o.id === id);
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
