import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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
import { CheckDialogComponent } from '../check-dialog/check-dialog.component';
import { log } from '../../../services/logger.service';

@Component({
  selector: 'app-visitor-registration',
  templateUrl: './visitor-registration.component.html',
  styleUrl: './visitor-registration.component.scss'
})
export class VisitorRegistrationComponent implements OnInit {
  control = new FormControl(null, Validators.required);
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
    hotelBookings: [],
    meetingRoomReservations: [],
    flights: []
  };

  //Is the simular to Serminarangmelung

  constructor(public translate: TranslateService, private dialog: MatDialog, private http: HttpService, private route: ActivatedRoute,
    private notificationService: NotificationService, public roleService: RoleService) { }


  ngOnInit(): void {
    this.getRepresentative();

    this.route.paramMap.subscribe(params => {
      if (params.get('id') != null) {
        this.http.getVisitorRegistrationById(parseInt(params.get('id')!)).subscribe({
          next: data => {
            if (data != null) {
              this.inputVisitRegistration = data;

              this.inputVisitRegistration.plannedDepartmentVisits.forEach(element => {
                var tmpVisit = this.listOfCurrentPageData.find(pageData => pageData.name === element.department);
                this.setOfCheckedId.set(tmpVisit!.id, [element.id!, (element.dateOfVisit !== null && element.dateOfVisit !== undefined) ? element.dateOfVisit!.toString().substring(0, 10) : ""])
              })

              // When the data is being loaded, sometimes the dates are converted from TypeScript into strings.
              // To ensure all necessary dates are in the correct format, I convert them.

              this.inputVisitRegistration.fromDate = this.convertToDate(this.inputVisitRegistration.fromDate);
              this.inputVisitRegistration.toDate = this.convertToDate(this.inputVisitRegistration.toDate);
              this.inputVisitRegistration.stayFromDate = this.convertToDate(this.inputVisitRegistration.stayFromDate);
              this.inputVisitRegistration.stayToDate = this.convertToDate(this.inputVisitRegistration.stayToDate);

              this.buttonSelect = [
                (data.factoryTour) ? "1" : "",
                (data.meetingroom) ? "2" : "",
                (data.airportTransferTrain) ? "3" : "",
                (data.meal) ? "4" : "",
                (data.hotelBooking) ? "5" : "",
                (data.isPlannedDepartmentVisits) ? "6" : "",

              ].filter(p => p != "");

            }
          },
          error: err => {
            log("Booking Request", err)
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
    if (department === 'gl' && this.checkRequired()) {
      this.getNotification(2);
      this.inputVisitRegistration.releaseManagement = new Date();
      this.inputVisitRegistration.releaserManagement = this.roleService.getUserName();
      this.postVisitorRegistration();

      this.http.sendMail(
        ["abteilungsleitung"],
        "B_" + this.inputVisitRegistration.id,
        "Freigabe GL",
        "Im Request Tool wurde eine Besucher Anfrage (Nr." + this.inputVisitRegistration.id + ") eingegeben und seitens GL freigegeben - bitte um kontrolle und Freigabe durch AL."
      ).subscribe();
      this.getNotification(7)
    } else if (department === 'al' && this.checkRequired()) {
      this.getNotification(3);
      this.inputVisitRegistration.releaseSupervisor = new Date();
      this.inputVisitRegistration.releaserSupervisor = this.roleService.getUserName()
      this.postVisitorRegistration();

      this.http.sendMail(
        ["fachberater", "vertreter", "creator", "front-office"],
        "B_" + this.inputVisitRegistration.id,
        "Freigabe AL",
        "Ihre Besucher Anfrage (Nr." + this.inputVisitRegistration.id + ") wurde erfolgreich freigegeben. Bitte prüfen Sie noch einmal ihre Anforderung, es ist möglich das Daten aus organisatorischen Gründen geändert wurden."
      ).subscribe();
      this.getNotification(8)
    }
  }

  openDialog(guests: Guest[]) {
    const dialogRef = this.dialog.open(TeilnehmerListeComponent, {
      height: '37.6rem',
      width: '50rem',
      data: {
        guests: guests,
        id: "B_" + this.inputVisitRegistration.id
      }
    });

    dialogRef.afterClosed().subscribe(
      data => {
        if (data !== undefined && data !== null) {
          this.inputVisitRegistration.guests = data;
        }
      });

  }

  addTab(type: number) {
    if (type === 1) {
      this.inputVisitRegistration.hotelBookings = [...this.inputVisitRegistration.hotelBookings, {}]
    } else if (type === 2) {
      this.inputVisitRegistration.meetingRoomReservations = [...this.inputVisitRegistration.meetingRoomReservations, {}]
    } else if (type === 3) {
      this.inputVisitRegistration.flights = [...this.inputVisitRegistration.flights, {}]
    }
  }

  deleteLast(type: number) {
    if (type === 1) {
      if (this.inputVisitRegistration.hotelBookings.length > 1)
        this.inputVisitRegistration.hotelBookings.pop();
    } else if (type === 2) {
      if (this.inputVisitRegistration.meetingRoomReservations.length > 1)
        this.inputVisitRegistration.meetingRoomReservations.pop();
    }
    else if (type === 3) {
      if (this.inputVisitRegistration.flights!.length > 1)
        this.inputVisitRegistration.flights!.pop();
    }
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
    this.inputVisitRegistration.factoryTour = this.buttonSelect.includes("1");
    this.inputVisitRegistration.meetingroom = this.buttonSelect.includes("2");
    this.inputVisitRegistration.airportTransferTrain = this.buttonSelect.includes("3");
    this.inputVisitRegistration.meal = this.buttonSelect.includes("4");
    this.inputVisitRegistration.hotelBooking = this.buttonSelect.includes("5");
    this.inputVisitRegistration.isPlannedDepartmentVisits = this.buttonSelect.includes("6");

    if (this.inputVisitRegistration.hotelBooking && this.inputVisitRegistration.hotelBookings.length === 0) {
      this.addTab(1);
    }

    if (this.inputVisitRegistration.meetingroom && this.inputVisitRegistration.meetingRoomReservations.length === 0) {
      this.addTab(2);
    }
    if (this.inputVisitRegistration.flights && this.inputVisitRegistration.flights.length === 0) {
      this.addTab(3);
    }
  }

  checkPopup() {
    if (this.checkRequired()) {
      const dialogRef = this.dialog.open(CheckDialogComponent, {
        width: '50%',
        data: 1
      });

      dialogRef.afterClosed().subscribe(
        data => {
          if (data === true) {
            this.postVisitorRegistration();
          }
        });
    }
  }

  postVisitorRegistration() {
    var sendmail: boolean = false;
    if (this.inputVisitRegistration.id === null || this.inputVisitRegistration.id === undefined || this.inputVisitRegistration.id === 0) {
      sendmail = true;
      this.inputVisitRegistration.dateOfCreation = new Date();
      this.inputVisitRegistration.creator = this.roleService.getUserName();
    }

    this.inputVisitRegistration.lastEditor = this.roleService.getUserName();

    this.inputVisitRegistration.showUser = true;
    this.inputVisitRegistration.reason = "VisitorRegistration"
    this.inputVisitRegistration.plannedDepartmentVisits = [];

    this.adjustDates()
    if (this.inputVisitRegistration.fromDate! > this.inputVisitRegistration.toDate!) {
      this.getNotification(10)
      return
    }

    if (this.inputVisitRegistration.stayFromDate! > this.inputVisitRegistration.stayToDate!) {
      this.getNotification(10)
      return
    }
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
        this.getNotification(1);
        this.inputVisitRegistration = data;
        if (sendmail) {
          this.http.sendMail(
            ["geschaeftsleitung"],
            "B_" + this.inputVisitRegistration.id,
            "Eingabe Besucheranfrage",
            "Im Request Tool wurde ein neue Besucher Anfrage (Nr." + this.inputVisitRegistration.id + ") eingegeben - bitte um Freigabe durch GL."
          ).subscribe();
          this.getNotification(9)
        }
        this.inputVisitRegistration.plannedDepartmentVisits.forEach(element => {
          var tmpVisit = this.listOfCurrentPageData.find(pageData => pageData.name === element.department);
          this.setOfCheckedId.set(tmpVisit!.id, [element.id!, element.dateOfVisit!.toString().substring(0, 10)])
        })
      },
      error: err => {
        console.log(err)
        //log("visitor-regristration: ", err)
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
        log("visitor-regristration: ", err)
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
      case 5: { // Pdf wurde erstellt
        this.translate.get('STANDARD.pdf1').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(0, translatedMessage, "Besuchernameldung_" + this.inputVisitRegistration.id + ".pdf", 'topRight');
        }); break;
      }
      case 6: { // Pdf konnte nicht erstellt werden
        this.translate.get('STANDARD.pdf2').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(4, translatedMessage, "Besuchernameldung_" + this.inputVisitRegistration.id + ".pdf", 'topRight');
        }); break;
      }
      case 7: { // Freigabe GL
        this.translate.get(['MAIL.sended', 'MAIL.gl'])
          .subscribe((translations: { [key: string]: string }) => {
            const message1 = translations['MAIL.sended'];
            const message2 = translations['MAIL.gl'];
            this.notificationService.createBasicNotification(0, message1, message2, 'topRight');
          });
        break;
      }
      case 8: { // Freigabe AL
        this.translate.get(['MAIL.sended', 'MAIL.al'])
          .subscribe((translations: { [key: string]: string }) => {
            const message1 = translations['MAIL.sended'];
            const message2 = translations['MAIL.al'];
            this.notificationService.createBasicNotification(0, message1, message2, 'topRight');
          });
        break;
      }
      case 9: { // Eingabe Besucher Anfrage
        this.translate.get(['MAIL.sended', 'MAIL.A_7'])
          .subscribe((translations: { [key: string]: string }) => {
            const message1 = translations['MAIL.sended'];
            const message2 = translations['MAIL.A_7'];
            this.notificationService.createBasicNotification(0, message1, message2, 'topRight');
          });
        break;
      }
      case 10: { //Datum falsch
        this.translate.get(['STANDARD.not_send', 'STANDARD.note'])
          .subscribe((translations: { [key: string]: string }) => {
            const message1 = translations['STANDARD.not_send'];
            const message2 = translations['STANDARD.note'];
            this.notificationService.createBasicNotification(4, message1, message2, 'topRight');
          });
        break;
      }
    }
  }

  getPdf() {
    if (this.inputVisitRegistration.id === null || this.inputVisitRegistration.id === undefined) {
      this.getNotification(6)
    }
    else {
      this.downloadFile();
      this.getNotification(5)
    }
  }
  downloadFile() {
    this.http.getVisitPdf(this.inputVisitRegistration.id!).subscribe(
      (response: Blob) => {
        this.saveFile(response, "Besuchernameldung_" + this.inputVisitRegistration.id + ".pdf")
      });
  }
  private saveFile(data: Blob, filename: string): void {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  checkRequired(): boolean {
    var checks: boolean[] = [false, false, false]
    var requriements: string[] = [
      (this.inputVisitRegistration.name === null || this.inputVisitRegistration.name === undefined || this.inputVisitRegistration.name === "") ? "1/VISITOR_REGRISTRATION.name" : "",
      (this.inputVisitRegistration.inputReason === null || this.inputVisitRegistration.inputReason === undefined || this.inputVisitRegistration.inputReason === "") ? "1/DASHBOARD.reason" : "",
      (this.inputVisitRegistration.fromDate === null || this.inputVisitRegistration.fromDate === undefined) ? "1/DASHBOARD.from" : "",
      (this.inputVisitRegistration.toDate === null || this.inputVisitRegistration.toDate === undefined) ? "1/DASHBOARD.to" : "",
      (this.inputVisitRegistration.fromTime === null || this.inputVisitRegistration.fromTime === undefined || this.inputVisitRegistration.fromTime === "") ? "1/VISITOR_REGRISTRATION.time" : "",
      (this.inputVisitRegistration.toTime === null || this.inputVisitRegistration.toTime === undefined || this.inputVisitRegistration.toTime === "") ? "1/VISITOR_REGRISTRATION.time" : "",
      (this.inputVisitRegistration.customerOrCompany === null || this.inputVisitRegistration.customerOrCompany === undefined || this.inputVisitRegistration.customerOrCompany === "") ? "2/VISITOR_REGRISTRATION.customer_company" : "",
      (this.inputVisitRegistration.guests === null || this.inputVisitRegistration.guests === undefined || this.inputVisitRegistration.guests.length === 0) ? "2/VISITOR_REGRISTRATION.participant_list" : "",
      (this.inputVisitRegistration.arrivalFromCountry === null || this.inputVisitRegistration.arrivalFromCountry === undefined || this.inputVisitRegistration.arrivalFromCountry === "") ? "2/VISITOR_REGRISTRATION.arrival_from_country" : "",
      (this.inputVisitRegistration.reasonForVisit === null || this.inputVisitRegistration.reasonForVisit === undefined || this.inputVisitRegistration.reasonForVisit === "") ? "2/ABSCHLUSSBERICHT.visit_reason_general" : "",
      (this.inputVisitRegistration.representative === null || this.inputVisitRegistration.representative === undefined) ? "3/MAIN_LIST.representative" : "",
      (this.inputVisitRegistration.stayFromDate === null || this.inputVisitRegistration.stayFromDate === undefined) ? "3/DASHBOARD.from" : "",
      (this.inputVisitRegistration.stayToDate === null || this.inputVisitRegistration.stayToDate === undefined) ? "3/DASHBOARD.to" : "",
    ];

    checks[0] = (requriements.filter(firsts => firsts.split("/")[0] === "1").length === 6)
    checks[1] = (requriements.filter(firsts => firsts.split("/")[0] === "2").length === 4)
    checks[2] = (requriements.filter(firsts => firsts.split("/")[0] === "3").length === 3)

    requriements = requriements.filter(element => {
      return (!checks[0] && element.split("/")[0] === "1") || (!checks[1] && element.split("/")[0] === "2") || (!checks[2] && element.split("/")[0] === "3") || (checks[0] && checks[1] && checks[2])
    }).map(element => element.split("/")[1]);

    if (requriements.length !== 0) {
      this.translate.get(['STANDARD.please_fill_required_fields', ...requriements.map(element => element)]).subscribe(translations => {
        const message = translations['STANDARD.please_fill_required_fields'];
        const anotherMessage = requriements.map(element => translations[element]).toString();
        this.notificationService.createBasicNotification(4, message, anotherMessage, 'topRight');
      });
    }
    return requriements.length === 0;
  }

  convertToDate(date: any): Date | undefined {
    return (date !== null && date !== undefined) ? new Date(date.toString()) : undefined;
  }

  adjustDates() {
    this.inputVisitRegistration.fromDate = this.setHours(this.inputVisitRegistration.fromDate);
    this.inputVisitRegistration.toDate = this.setHours(this.inputVisitRegistration.toDate);
    this.inputVisitRegistration.stayFromDate = this.setHours(this.inputVisitRegistration.stayFromDate);
    this.inputVisitRegistration.stayToDate = this.setHours(this.inputVisitRegistration.stayToDate);
    this.inputVisitRegistration.tourDate = this.setHours(this.inputVisitRegistration.tourDate);
    this.inputVisitRegistration.meetingRoomReservations!.forEach(element => {
      element.meetingRoomDate = this.setHours(element.meetingRoomDate);
    });
    this.inputVisitRegistration.hotelBookings!.forEach(element => {
      element.hotelStayFromDate = this.setHours(element.hotelStayFromDate);
      element.hotelStayToDate = this.setHours(element.hotelStayToDate);
    });
    this.inputVisitRegistration.mealDateFrom = this.setHours(this.inputVisitRegistration.mealDateFrom);
    this.inputVisitRegistration.mealDateTo = this.setHours(this.inputVisitRegistration.mealDateTo);
    this.inputVisitRegistration.plannedDepartmentVisits!.forEach(element => {
      element.dateOfVisit = this.setHours(element.dateOfVisit);
    });
    this.inputVisitRegistration.flights!.forEach(element => {
      element.flightDate = this.setHours(element.flightDate);
    });
  }
  setHours(date: any) {
    return (date !== null && date !== undefined) ? new Date(new Date(new Date(date.toString()).setHours(5))) : undefined;
  }

}
