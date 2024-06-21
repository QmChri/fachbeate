import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Department } from '../../../models/department';
import { VisitorRegistration } from '../../../models/visitor-registration';
import { MatDialog } from '@angular/material/dialog';
import { TeilnehmerListeComponent } from '../teilnehmer-liste/teilnehmer-liste.component';
import { HttpService } from '../../../services/http.service';
import { Guest } from '../../../models/guest';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { RoleService } from '../../../services/role.service';
import { Representative } from '../../../models/representative';

@Component({
  selector: 'app-visitor-registration',
  templateUrl: './visitor-registration.component.html',
  styleUrl: './visitor-registration.component.scss'
})
export class VisitorRegistrationComponent implements OnInit {
  buttonSelect: String[] = []
  geDip: String[] = []
  representative: Representative[] = [];

  inputVisitRegistration: VisitorRegistration = {
    plannedDepartmentVisits: [],
    guests: [],
    hotelBookings: []
  };

  constructor(private dialog: MatDialog, private http: HttpService, private route: ActivatedRoute,
    private notificationService: NotificationService, public roleService: RoleService) { }

  release(department: string) {
    if (department === 'gl') {
      this.notificationService.createBasicNotification(0, 'Freigabe von GL wurde erteilt!', '', 'topRight');
      this.inputVisitRegistration.releaseManagement = new Date();
      this.inputVisitRegistration.releaserManagement = this.roleService.getUserName();
    }else {
      this.notificationService.createBasicNotification(0, 'Freigabe von AL wurde erteilt!', '', 'topRight');
      this.inputVisitRegistration.releaseSupervisor = new Date();
      this.inputVisitRegistration.releaserSupervisor = this.roleService.getUserName()
    }
  }
  
  openDialog(guests: Guest[]) {

    const dialogRef = this.dialog.open(TeilnehmerListeComponent, {
      height: '37.6rem',
      width: '50rem',
      data: guests
    });

    dialogRef.afterClosed().subscribe(
      data => {
        if (data !== undefined && data !== null) {
          this.inputVisitRegistration.guests = data;
        }
      });

  }

  selected = new FormControl(0);

  addTab() {
    this.inputVisitRegistration.hotelBookings = [...this.inputVisitRegistration.hotelBookings, {}]
  }

  deleteLast() {
    if (this.inputVisitRegistration.hotelBookings.length != 1)
      this.inputVisitRegistration.hotelBookings.pop();
  }

  languageControl = new FormControl();
  languageFilterCtrl = new FormControl();

  abteilungen = [
    { value: 'GL', label: 'Geschäftsleitung' },
    { value: 'AB', label: 'Auftragsbearbeitung' }
  ];

  listOfCurrentPageData: readonly Department[] = [];
  setOfCheckedId = new Map<number, [number?, string?]>();


  onItemChecked(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.set(id, [undefined!, ""]);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onCurrentPageDataChange($event: readonly Department[]): void {
    this.listOfCurrentPageData = $event;
  }

  inputDateChange(id: number, date: string) {
    let tmpId = this.setOfCheckedId.get(id)![0];
    this.setOfCheckedId.set(id, [(tmpId) ? tmpId : undefined!, date]);
  }

  ngOnInit(): void {
    this.getRepresentative();
    this.addTab();
    this.route.paramMap.subscribe(params => {
      if (params.get('id') != null) {
        this.http.getVisitorRegistrationById(parseInt(params.get('id')!)).subscribe({
          next: data => {
            if (data != null) {
              this.inputVisitRegistration = data;

              this.inputVisitRegistration.plannedDepartmentVisits.forEach(element => {
                var tmpVisit = this.listOfCurrentPageData.find(pageData => pageData.name === element.department);
                this.setOfCheckedId.set(tmpVisit!.id, [element.id!, element.dateOfVisit!.toString().substring(0, 10)])
              })

              this.buttonSelect = [
                (data.hotelBooking) ? "1" : "",
                (data.flightBooking) ? "2" : "",
                (data.trip) ? "3" : "",
                (data.companyTour) ? "4" : "",
                (data.meal) ? "5" : "",
                (data.customerPresent) ? "6" : "",
                (data.diploma) ? "7" : ""
              ].filter(p => p != "");
            }
          },
          error: err => {
            console.log(err);
          }
        });
      }
    });

    this.listOfCurrentPageData = [
      {
        id: 1,
        name: 'boss',
        checked: false,
        dateOfVisit: new Date()
      },
      {
        id: 2,
        name: 'applicationTechnology',
        checked: false,
        dateOfVisit: new Date()
      },
      {
        id: 3,
        name: 'productDevelopment',
        checked: false,
        dateOfVisit: new Date()
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
      },
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

  changeSelections() {
    this.inputVisitRegistration.hotelBooking = this.buttonSelect.includes("1");
    this.inputVisitRegistration.flightBooking = this.buttonSelect.includes("2");
    this.inputVisitRegistration.trip = this.buttonSelect.includes("3");
    this.inputVisitRegistration.companyTour = this.buttonSelect.includes("4");
    this.inputVisitRegistration.meal = this.buttonSelect.includes("5");
    this.inputVisitRegistration.customerPresent = this.buttonSelect.includes("6");
    this.inputVisitRegistration.diploma = this.buttonSelect.includes("7");
  }

  postVisitorRegistration() {

    this.inputVisitRegistration.creator = this.roleService.getUserName();
    this.notificationService.createBasicNotification(0, 'Formular wurde gesendet!', '', 'topRight');
    this.inputVisitRegistration.reason = "VisitorRegistration"

    this.inputVisitRegistration.plannedDepartmentVisits = []

    this.setOfCheckedId.forEach((value, key) => {
      this.inputVisitRegistration.plannedDepartmentVisits = [...this.inputVisitRegistration.plannedDepartmentVisits!,
      {
        id: value[0],
        department: this.getDepartment(key),
        dateOfVisit: new Date(value[1]!)
      }
      ]
    });

    this.http.postVisitorRegistration(this.inputVisitRegistration).subscribe({
      next: data => {
        this.inputVisitRegistration = data;
        this.inputVisitRegistration.plannedDepartmentVisits.forEach(element => {
          var tmpVisit = this.listOfCurrentPageData.find(pageData => pageData.name === element.department);
          this.setOfCheckedId.set(tmpVisit!.id, [element.id!, element.dateOfVisit!.toString().substring(0, 10)])
        })
      },
      error: err => {
        console.log(err);
      }
    })
  }

  getDepartment(id: number): string {
    var found = this.listOfCurrentPageData.find(element => element.id === id)
    if (found !== null && found !== undefined) {
      return found!.name;
    }
    return "";
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
  changeRepresentative($event: any) {
    this.inputVisitRegistration.representative = this.representative.find(elemnt => elemnt.id === $event);
  }


}

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
