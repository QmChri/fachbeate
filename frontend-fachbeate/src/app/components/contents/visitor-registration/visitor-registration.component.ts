import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Department } from '../../../models/department';
import { MatDialog } from '@angular/material/dialog';
import { TeilnehmerListeComponent } from '../teilnehmer-liste/teilnehmer-liste.component';

@Component({
  selector: 'app-visitor-registration',
  templateUrl: './visitor-registration.component.html',
  styleUrl: './visitor-registration.component.scss'
})
export class VisitorRegistrationComponent implements OnInit {
  panelOpenState = false;
  panelOpenState1 = false;
  panelOpenState2 = false;
  panelOpenState3 = false;
  panelOpenState4 = false;
  panelOpenState5 = false;
  buttonSelect: String[] = []
  geDip: String[] = []

  constructor(private dialog: MatDialog) { }

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
