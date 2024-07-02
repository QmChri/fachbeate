import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-visitor-registration',
  templateUrl: './visitor-registration.component.html',
  styleUrl: './visitor-registration.component.scss'
})
export class VisitorRegistrationComponent implements OnInit {
  buttonSelect: String[] = []
  geDip: String[] = []
  representative: Representative[] = [];
  selected = new FormControl(0);
  freigegeben: boolean = true;
  languageControl = new FormControl();
  languageFilterCtrl = new FormControl();
  listOfCurrentPageData: readonly Department[] = [];
  setOfCheckedId = new Map<number, [number?, string?]>();
  abteilungen = [
    { value: 'GL', label: 'Geschäftsleitung' },
    { value: 'AB', label: 'Auftragsbearbeitung' }
  ];
  inputVisitRegistration: VisitorRegistration = {
    plannedDepartmentVisits: [],
    guests: [],
    hotelBookings: []
  };

  constructor(private translate: TranslateService, private dialog: MatDialog, private http: HttpService, private route: ActivatedRoute,
    private notificationService: NotificationService, public roleService: RoleService) { }

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
        name: 'management',
        checked: false,
        dateOfVisit: new Date()
      },
      {
        id: 2,
        name: 'application_technology',
        checked: false,
        dateOfVisit: new Date()
      },
      {
        id: 3,
        name: 'product_development',
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
        name: 'payroll_office',
        checked: false,
        dateOfVisit: new Date()
      },
      {
        id: 7,
        name: 'order_processing',
        checked: false,
        dateOfVisit: new Date()
      },
      {
        id: 8,
        name: 'quality_raw_material_management',
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
        name: 'legal_financial_affairs',
        checked: false,
        dateOfVisit: new Date()
      },
      {
        id: 11,
        name: 'innov8_lab',
        checked: false,
        dateOfVisit: new Date()
      }
    ]

  }

  release(department: string) {
    if (department === 'gl') {
      this.getNotification(2);
      this.inputVisitRegistration.releaseManagement = new Date();
      this.inputVisitRegistration.releaserManagement = this.roleService.getUserName();
      this.postVisitorRegistration();
    } else {
      this.getNotification(3);
      this.inputVisitRegistration.releaseSupervisor = new Date();
      this.inputVisitRegistration.releaserSupervisor = this.roleService.getUserName()
      this.postVisitorRegistration();
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

  addTab() {
    this.inputVisitRegistration.hotelBookings = [...this.inputVisitRegistration.hotelBookings, {}]
  }

  deleteLast() {
    if (this.inputVisitRegistration.hotelBookings.length != 1)
      this.inputVisitRegistration.hotelBookings.pop();
  }

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
    this.getNotification(1);
    this.inputVisitRegistration.showUser = true;
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
      case 4: { // Pflichtfelder ausfüllen
        this.translate.get(['STANDARD.please_fill_required_fields', 'STANDARD.assigned_representative']).subscribe(translations => {
          const message = translations['STANDARD.please_fill_required_fields'];
          const anotherMessage = translations['STANDARD.assigned_representative'];
          this.notificationService.createBasicNotification(4, message, anotherMessage, 'topRight');
        }); break;
      }
    }
  }
}
