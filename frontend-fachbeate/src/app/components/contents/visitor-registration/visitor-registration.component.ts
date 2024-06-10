import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Department } from '../../../models/department';
import { VisitorRegistration } from '../../../models/visitor-registration';

@Component({
  selector: 'app-visitor-registration',
  templateUrl: './visitor-registration.component.html',
  styleUrl: './visitor-registration.component.scss'
})
export class VisitorRegistrationComponent implements OnInit {
  buttonSelect: String[] = []
  geDip: String[] = []

  inputVisitRegistration: VisitorRegistration = {};

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly Department[] = [];
  listOfCurrentPageData2: readonly Department[] = [];
  setOfCheckedId = new Set<number>();

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly Department[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  ngOnInit(): void {
    this.listOfCurrentPageData = [
      {
        id: 1,
        name: 'Geschäftsleitung',
        checked: false,
      },
      {
        id: 2,
        name: 'Anwendungstechnik',
        checked: false,
      },
      {
        id: 3,
        name: 'Produktentwicklung',
        checked: false,
      },
      {
        id: 4,
        name: 'Marketing',
        checked: false,
        dateOfVisit: new Date()
      },
      {
        id: 5,
        name: 'EDV',
        checked: false,
        dateOfVisit: new Date()
      },
      {
        id: 6,
        name: 'Lohnbüro',
        checked: false,
        dateOfVisit: new Date()
      }
    ]

    this.listOfCurrentPageData2 = [
      {
        id: 7,
        name: 'Auftragsbearbeitung',
        checked: false,
        dateOfVisit: new Date()
      },
      {
        id: 8,
        name: 'Qualitäts- Rohstoffmanagement',
        checked: false,
        dateOfVisit: new Date()
      },
      {
        id: 9,
        name: 'Kalkulation',
        checked: false,
        dateOfVisit: new Date()
      },
      {
        id: 10,
        name: 'Rechts- / Finanzwesen',
        checked: false,
        dateOfVisit: new Date()
      },
      {
        id: 11,
        name: 'Innov8 / Labor',
        checked: false,
        dateOfVisit: new Date()
      }
    ]
  }
}

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
