import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Department } from '../../../models/department';
import { VisitorRegistration } from '../../../models/visitor-registration';
import { MatDialog } from '@angular/material/dialog';
import { TeilnehmerListeComponent } from '../teilnehmer-liste/teilnehmer-liste.component';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'app-visitor-registration',
  templateUrl: './visitor-registration.component.html',
  styleUrl: './visitor-registration.component.scss'
})
export class VisitorRegistrationComponent implements OnInit {
  buttonSelect: String[] = []
  geDip: String[] = []

  inputVisitRegistration: VisitorRegistration = {
    plannedDepartmentVisits: []
  };

  constructor(private dialog: MatDialog, private http: HttpService) { }

  openDialog(cnt: number) {

    this.dialog.open(TeilnehmerListeComponent, {
      height: '36rem',
      width: '50rem',
      data: cnt
    });
    /*
        dialogRef.afterClosed().subscribe(
          data => {
            if (data.save) {
              customerVisit.finalReport = data.finalReport;
              this.postCustomerRequirement();
            }
          });*/
  }


  
  tabs = ['Hotelbuchung'];
  selected = new FormControl(0);

  addTab() {
    this.tabs.push('Hotelbuchung: '+ this.tabs.length);
    this.selected.setValue(this.tabs.length - 1);
  }

  deleteLast() {
    if (this.tabs.length != 1)
      this.tabs.pop();
  }
  campaignOne = new FormGroup({
    start: new FormControl(new Date(year, month, 13)),
    end: new FormControl(new Date(year, month, 16)),
  });
  campaignTwo = new FormGroup({
    start: new FormControl(new Date(year, month, 15)),
    end: new FormControl(new Date(year, month, 19)),
  });
  languageControl = new FormControl();
  languageFilterCtrl = new FormControl();
  languages = [
    { value: 'en', label: 'English', flag: 'assets/flags/en.png' },
    { value: 'de', label: 'Deutsch', flag: 'assets/flags/de.png' }
  ];
  abteilungen = [
    { value: 'GL', label: 'Geschäftsleitung' },
    { value: 'AB', label: 'Auftragsbearbeitung' }
  ];

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly Department[] = [];
  listOfCurrentPageData2: readonly Department[] = [];
  setOfCheckedId = new Map<number, string>();

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.set(id, undefined!);
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

  inputDateChange(id: number, date: string){
    this.setOfCheckedId.set(id, date);
  }

  ngOnInit(): void {
    this.listOfCurrentPageData = [
      {
        id: 1,
        name: 'boss',
        checked: false,
      },
      {
        id: 2,
        name: 'applicationTechnology',
        checked: false,
      },
      {
        id: 3,
        name: 'productDevelopment',
        checked: false,
      },
      {
        id: 4,
        name: 'marketing',
        checked: false,
        dateOfVisit: new Date()
      },
      {
        id: 5,
        name: 'it',
        checked: false,
        dateOfVisit: new Date()
      },
      {
        id: 6,
        name: 'payOffice',
        checked: false,
        dateOfVisit: new Date()
      }
    ]

    this.listOfCurrentPageData2 = [
      {
        id: 7,
        name: 'orderProcessing',
        checked: false,
        dateOfVisit: new Date()
      },
      {
        id: 8,
        name: 'qualityMaterialsManagement',
        checked: false,
        dateOfVisit: new Date()
      },
      {
        id: 9,
        name: 'calculation',
        checked: false,
        dateOfVisit: new Date()
      },
      {
        id: 10,
        name: 'legalFinance',
        checked: false,
        dateOfVisit: new Date()
      },
      {
        id: 11,
        name: 'innov8Labor',
        checked: false,
        dateOfVisit: new Date()
      }
    ]
  }

  postVisitorRegistration(){
    this.inputVisitRegistration.reason = "VisitorRegistration"

    this.inputVisitRegistration.plannedDepartmentVisits = []

    this.setOfCheckedId.forEach((value, key) => {
      this.inputVisitRegistration.plannedDepartmentVisits = [...this.inputVisitRegistration.plannedDepartmentVisits!, 
        {
          department: this.getDepartment(key),
          dateOfVisit: new Date(value)
        }
      ]
    });    

    this.http.postVisitorRegistration(this.inputVisitRegistration).subscribe({
      next: data => {
        this.inputVisitRegistration = data;
      },
      error: err => {
        console.log(err);
      }
    })
  }

  getDepartment(id: number):string{
    var found = this.listOfCurrentPageData.find(element => element.id === id)
    if(found !== null && found !== undefined){
      return found!.name;
    }

    found = this.listOfCurrentPageData2.find(element => element.id === id)
    if(found !== null && found !== undefined){
      return found!.name;
    }
    return "";
  }

}

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
