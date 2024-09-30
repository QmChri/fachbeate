import { Component, OnInit } from '@angular/core';
import { WorkshopRequirement } from '../../../models/workshop-requirement';
import { HttpService } from '../../../services/http.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TeilnehmerListeComponent } from '../teilnehmer-liste/teilnehmer-liste.component';
import { Guest } from '../../../models/guest';
import { NotificationService } from '../../../services/notification.service';
import { RoleService } from '../../../services/role.service';
import { Company } from '../../../models/company';
import { Representative } from '../../../models/representative';
import { TranslateService } from '@ngx-translate/core';
import { TechDateDTO } from '../../../models/tech-date-dto';
import { CheckDialogComponent } from '../check-dialog/check-dialog.component';
import { log } from '../../../services/logger.service';

@Component({
  selector: 'app-seminar-registration',
  templateUrl: './seminar-registration.component.html',
  styleUrl: './seminar-registration.component.scss'
})
export class SeminarRegistrationComponent implements OnInit {
  buttonSelect: number[] = []
  companies: Company[] = [];
  representative: Representative[] = [];
  control = new FormControl(null, Validators.required);
  addItem: string = "";
  technologists: TechDateDTO[] = [];
  reasonSelect: number = 0;
  languages: string[] = ['DE', 'EN', 'RU'];
  tabs = ['Hotelbuchung']
  freigegeben: boolean = true;
  selected = new FormControl(0);
  inputWorkshop: WorkshopRequirement = {
    techSelection: [],
    requestedTechnologist: [],
    guests: [],
    hotelBookings: [],
    flights: []
  };

  constructor(public translate: TranslateService, private dialog: MatDialog, private http: HttpService, private route: ActivatedRoute,
    private notificationService: NotificationService, public roleService: RoleService) {
  }

  ngOnInit(): void {
    this.getCompanies();
    this.getRepresentative();
    this.route.paramMap.subscribe(params => {
      if (params.get('id') != null) {
        this.http.getWorkshopById(parseInt(params.get('id')!)).subscribe({
          next: data => {
            if (data != null) {
              this.inputWorkshop = data;

              this.inputWorkshop.startDate = this.convertToDate(this.inputWorkshop.startDate);
              this.inputWorkshop.endDate = this.convertToDate(this.inputWorkshop.endDate);

              this.inputWorkshop.techSelection = data.requestedTechnologist!.map(tech => tech.id!);

              this.buttonSelect = [
                (data.hotelBooking) ? 5 : -1,
                (data.flightBooking) ? 3 : -1,
                (data.trip) ? 2 : -1,
                (data.companyTour) ? 1 : -1,
                (data.meal) ? 4 : -1,
                (data.customerPresent) ? 6 : -1,
                (data.diploma) ? 7 : -1
              ].filter(p => p != -1);
            }
          },
          error: err => {
            log("seminar-regristration: ", err)
          }
        });
      } else {
        this.addTab(1);
        this.addTab(2);
      }
    });
    this.getTechnologists();
  }


  disableTechDate = (current: Date): boolean => {

    if (this.inputWorkshop.requestedTechnologist === undefined) {
      return true; // Keine Technologenanforderung, also alle Daten deaktivieren
    }

    const reqTechDate = this.technologists.filter(
      element => this.inputWorkshop.requestedTechnologist!.some(tech => tech.id === element.technologist.id)
    );

    if (!reqTechDate) {
      return true; // Kein passender Technologe gefunden, daher alle Daten deaktivieren
    }
    // Überprüfen, ob das aktuelle Datum in einem der Zeiträume liegt
    var isDateValid = reqTechDate.some(req => req.appointments.some(
      element => this.isDateBetween(new Date(current?.setHours(7)), new Date(element[0].toString()), new Date(element[1].toString()))
    ));

    return !isDateValid; // Datum deaktivieren, wenn es nicht gültig ist
  }

  isDateBetween(date: Date, startDate: Date, endDate: Date): boolean {
    return date > new Date(startDate?.setHours(5)) && date < new Date(endDate?.setHours(9));
  }

  checkRequired(): boolean {
    var requiredFields: string[] = [
      (this.inputWorkshop.company === null || this.inputWorkshop.company === undefined) ? "assigned_company" : "",
      (this.inputWorkshop.customer === null || this.inputWorkshop.customer === undefined) ? "assigned_technologist" : "",
      (this.inputWorkshop.startDate === null || this.inputWorkshop.startDate === undefined) ? "assigned_from" : "",
      (this.inputWorkshop.endDate === null || this.inputWorkshop.endDate === undefined) ? "assigned_to" : "",
      (this.inputWorkshop.guests === null || this.inputWorkshop.guests === undefined || this.inputWorkshop.guests.length === 0) ? "assigned_participants" : "",
      (this.inputWorkshop.representative === null || this.inputWorkshop.representative === undefined) ? "assigned_repre" : "",
      (this.inputWorkshop.amountParticipants === null || this.inputWorkshop.amountParticipants === undefined || this.inputWorkshop.amountParticipants === 0) ? "assigned_amount" : ""
    ].filter(element => element !== "");

    if (requiredFields.length !== 0) {
      this.translate.get(['STANDARD.please_fill_required_fields', ...requiredFields.map(element => "STANDARD." + element)]).subscribe(translations => {
        const message = translations['STANDARD.please_fill_required_fields'];
        const anotherMessage = requiredFields.map(element => translations["STANDARD." + element]).toString();
        this.notificationService.createBasicNotification(4, message, anotherMessage, 'topRight');
      });
    }
    return requiredFields.length === 0;
  }

  addTab(type: number) {
    if (type === 1) {
      this.inputWorkshop.hotelBookings = [...this.inputWorkshop.hotelBookings!, {}]
    } else if (type === 2) {
      this.inputWorkshop.flights = [...this.inputWorkshop.flights, {}]
    }
  }

  deleteLast(type: number) {
    if (type === 1) {
      if (this.inputWorkshop.hotelBookings!.length > 1)
        this.inputWorkshop.hotelBookings!.pop();
    } else if (type === 2) {
      if (this.inputWorkshop.flights!.length > 1)
        this.inputWorkshop.flights!.pop();
    }
  }

  openDialog(guests: Guest[]) {

    const dialogRef = this.dialog.open(TeilnehmerListeComponent, {
      height: '37.6rem',
      width: '50rem',
      data: {
        guests: guests,
        id: "S_" + this.inputWorkshop.id
      }
    });

    dialogRef.afterClosed().subscribe(
      data => {
        if (data !== undefined && data !== null) {
          this.inputWorkshop.guests = data;
        }
      });

  }

  addToList(addItem: string) {
    this.languages.push(addItem);
  }

  release(department: string) {
    if (department === 'gl' && this.checkRequired()) {
      this.getNotification(2);
      this.inputWorkshop.releaseManagement = new Date();
      this.inputWorkshop.releaserManagement = this.roleService.getUserName()
      this.postWorkshopRequest();

      this.http.sendMail(
        ["abteilungsleitung"],
        "S_" + this.inputWorkshop.id,
        "Freigabe GL",
        "Im Request Tool wurde eine Seminar Anfrage (Nr." + this.inputWorkshop.id + ") eingegeben und seitens GL freigegeben - bitte um kontrolle und Freigabe durch AL."
      ).subscribe();
      this.getNotification(9);
    }
    else if (department === 'al' && this.checkRequired()) {
      this.getNotification(3);
      this.inputWorkshop.releaseSupervisor = new Date();
      this.inputWorkshop.releaserSupervisor = this.roleService.getUserName()
      this.postWorkshopRequest();

      this.http.sendMail(
        ["fachberater", "vertreter", "creator", "front-office"],
        "S_" + this.inputWorkshop.id,
        "Freigabe AL",
        "Ihre Seminar Anfrage (Nr." + this.inputWorkshop.id + ") wurde erfolgreich freigegeben. Bitte prüfen Sie noch einmal ihre Anforderung, es ist möglich das Daten aus organisatorischen Gründen geändert wurden"
      ).subscribe();
      this.getNotification(10);
    }
  }

  changeCompany($event: any) {
    this.inputWorkshop.company = this.companies.find(elemnt => elemnt.id === $event);
  }

  getCompanies() {
    this.http.getActiveCompany().subscribe({
      next: data => {
        this.companies = data;

        if (this.roleService.checkPermission([6])) {
          this.inputWorkshop.company = this.companies.find(element => element.username === this.roleService.getUserName())!;
        }
      },
      error: err => {
        log("seminar-regristration: ", err)
      }
    });
  }

  changeRepresentative($event: any) {
    this.inputWorkshop.representative = this.representative.find(elemnt => elemnt.id === $event);
  }

  getRepresentative() {
    this.http.getActiveRepresentative().subscribe({
      next: data => {
        this.representative = data;
      },
      error: err => {
        log("seminar-regristration: ", err)
      }
    });
  }

  getTechnologists() {
    this.http.getActiveWithDates().subscribe({
      next: data => {
        this.technologists = data;
      },
      error: err => {
        log("seminar-regristration: ", err)
      }
    });
  }

  changeTechnolgist(event: number[]) {
    this.inputWorkshop.requestedTechnologist = event.map(id =>
      this.technologists.find(tech => tech.technologist.id === id)!.technologist
    );
  }

  //Function for changing the booking selection
  changeSelections(event: any, section: number) {
    // selection is divided into 2 subselections, it must be checked which
    // one has just been updated and then it is set with the other one.
    this.buttonSelect = (section === 0) ? this.buttonSelect.filter(number => Number(number) >= 6 && Number(number) <= 7) : this.buttonSelect.filter(number => Number(number) >= 1 && Number(number) <= 5);
    this.buttonSelect = [...this.buttonSelect, ...event.value]

    this.inputWorkshop.companyTour = this.buttonSelect.includes(1);
    this.inputWorkshop.trip = this.buttonSelect.includes(2);
    this.inputWorkshop.flightBooking = this.buttonSelect.includes(3);
    this.inputWorkshop.meal = this.buttonSelect.includes(4);
    this.inputWorkshop.hotelBooking = this.buttonSelect.includes(5);
    this.inputWorkshop.customerPresent = this.buttonSelect.includes(6);
    this.inputWorkshop.diploma = this.buttonSelect.includes(7);
  }

  checkPopup() {
    if (this.checkRequired()) {
      const dialogRef = this.dialog.open(CheckDialogComponent, {
        width: '50%',
        data: 2
      });

      dialogRef.afterClosed().subscribe(
        data => {
          if (data === true) {
            this.postWorkshopRequest();
          }
        });
    }
  }

  postWorkshopRequest() {
    var sendmail: boolean = false;
    if (this.checkRequired()) {
      this.inputWorkshop.showUser = true;
      //this.inputWorkshop.reason = "Seminaranmeldung"
      this.inputWorkshop.dateOfCreation = new Date();
      if (this.inputWorkshop.creator === null || this.inputWorkshop.creator === undefined) {
        sendmail = true;
        this.inputWorkshop.creator = this.roleService.getUserName();
      }

      this.adjustDates();

      this.inputWorkshop.lastEditor = this.inputWorkshop.lastEditor;

      this.http.postWorkshop(this.inputWorkshop).subscribe({
        next: data => {
          this.getNotification(1);
          this.inputWorkshop = data;
          if (sendmail) {
            this.http.sendMail(
              ["geschaeftsleitung"],
              "B_" + this.inputWorkshop.id,
              "Eingabe Seminaranfrage",
              "Im Request Tool wurde eine neue Seminar Anfrage (Nr." + this.inputWorkshop.id + ") eingegeben - bitte um Freigabe durch GL."
            ).subscribe();
            this.getNotification(11);
          }
          this.inputWorkshop.techSelection = data.requestedTechnologist!.map(element => element.id!);

          this.buttonSelect = [
            (data.hotelBooking) ? 5 : -1,
            (data.flightBooking) ? 3 : -1,
            (data.trip) ? 2 : -1,
            (data.companyTour) ? 1 : -1,
            (data.meal) ? 4 : -1,
            (data.customerPresent) ? 6 : -1,
            (data.diploma) ? 7 : -1
          ].filter(p => p != -1);
        },
        error: err => {
          log("seminar-regristration: ", err)
        }
      })
    }
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
      case 4: { // Pdf wurde erstellt
        this.translate.get('STANDARD.pdf1').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(0, translatedMessage, "Seminaranmeldung_" + this.inputWorkshop.id + ".pdf", 'topRight');
        }); break;
      }
      case 5: { // Pdf konnte nicht erstellt werden
        this.translate.get('STANDARD.pdf2').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(4, translatedMessage, "Seminaranmeldung_" + this.inputWorkshop.id + ".pdf", 'topRight');
        }); break;
      }
      case 9: { // Freigabe GL
        this.translate.get(['MAIL.sended', 'MAIL.gl'])
          .subscribe((translations: { [key: string]: string }) => {
            const message1 = translations['MAIL.sended'];
            const message2 = translations['MAIL.gl'];
            this.notificationService.createBasicNotification(0, message1, message2, 'topRight');
          });
        break;
      }
      case 10: { // Freigabe AL
        this.translate.get(['MAIL.sended', 'MAIL.al'])
          .subscribe((translations: { [key: string]: string }) => {
            const message1 = translations['MAIL.sended'];
            const message2 = translations['MAIL.al'];
            this.notificationService.createBasicNotification(0, message1, message2, 'topRight');
          });
        break;
      }
      case 11: { // Eingabe Seminaranfrage
        this.translate.get(['MAIL.sended', 'MAIL.A_6'])
          .subscribe((translations: { [key: string]: string }) => {
            const message1 = translations['MAIL.sended'];
            const message2 = translations['MAIL.A_6'];
            this.notificationService.createBasicNotification(0, message1, message2, 'topRight');
          });
        break;
      }
    }
  }

  getPdf() {
    if (this.inputWorkshop.id === null || this.inputWorkshop.id === undefined) {
      this.getNotification(5)
    }
    else {
      this.downloadFile();
      this.getNotification(4)
    }
  }
  downloadFile() {
    this.http.getWorkshopPdf(this.inputWorkshop.id!).subscribe(
      (response: Blob) => {
        this.saveFile(response, "Seminaranmeldung_" + this.inputWorkshop.id + ".pdf")
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

  convertToDate(date: any): Date | undefined {
    return (date !== null && date !== undefined) ? new Date(date.toString()) : undefined;
  }

  adjustDates() {
    this.inputWorkshop.startDate = this.setHours(this.inputWorkshop.startDate);
    this.inputWorkshop.endDate = this.setHours(this.inputWorkshop.endDate);
    this.inputWorkshop.flights!.forEach(element => { element.flightDate = this.setHours(element.flightDate); });
    this.inputWorkshop.hotelBookings!.forEach(element => {
      element.hotelStayFromDate = this.setHours(element.hotelStayFromDate);
      element.hotelStayToDate = this.setHours(element.hotelStayToDate);
    });
    this.inputWorkshop.tripDate = this.setHours(this.inputWorkshop.tripDate);
    this.inputWorkshop.tourDate = this.setHours(this.inputWorkshop.tourDate);
    this.inputWorkshop.mealDateFrom = this.setHours(this.inputWorkshop.mealDateFrom);
    this.inputWorkshop.mealDateTo = this.setHours(this.inputWorkshop.mealDateTo);

  }
  setHours(date: any) {
    return (date !== null && date !== undefined) ? new Date(new Date(new Date(date.toString()).setHours(5))) : undefined;
  }
}
