import { Component, OnInit } from '@angular/core';
import { WorkshopRequirement } from '../../../models/workshop-requirement';
import { HttpService } from '../../../services/http.service';
import { Technologist } from '../../../models/technologist';
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

@Component({
  selector: 'app-seminar-registration',
  templateUrl: './seminar-registration.component.html',
  styleUrl: './seminar-registration.component.scss'
})
export class SeminarRegistrationComponent implements OnInit {
  buttonSelect: string[] = []
  companies: Company[] = [];
  representative: Representative[] = [];
  control = new FormControl(null, Validators.required);
  addItem: string = "";
  technologists: Technologist[] = [];
  reasonSelect: number = 0;
  languages: string[] = ['DE', 'EN', 'RU'];
  tabs = ['Hotelbuchung']
  freigegeben: boolean = true;
  selected = new FormControl(0);
  inputWorkshop: WorkshopRequirement = {
    techSelection: [],
    requestedTechnologist: [],
    guests: [],
    hotelBookings: []
  };

  constructor(private translate: TranslateService, private dialog: MatDialog, private http: HttpService, private route: ActivatedRoute,
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

              this.inputWorkshop.techSelection = data.requestedTechnologist!.map(tech => tech.id!);

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
    this.addTab();
    this.getTechnologists();
  }

  checkRequired(): boolean {
    if (!this.inputWorkshop.company ||
      !this.inputWorkshop.customer ||
      !this.inputWorkshop.startDate ||
      !this.inputWorkshop.endDate ||
      !this.inputWorkshop.guests![0] ||
      !this.inputWorkshop.representative) {
      this.getNotification(4)
      return false;
    }
    return true;
  }

  addTab() {
    this.inputWorkshop.hotelBookings = [...this.inputWorkshop.hotelBookings!, {}]
  }

  deleteLast() {
    if (this.inputWorkshop.hotelBookings!.length > 1)
      this.inputWorkshop.hotelBookings!.pop();
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
    }
    else if (department === 'al' && this.checkRequired()) {
      this.getNotification(3);
      this.inputWorkshop.releaseSupervisor = new Date();
      this.inputWorkshop.releaserSupervisor = this.roleService.getUserName()
      this.postWorkshopRequest();

    }
  }

  changeCompany($event: any) {
    this.inputWorkshop.company = this.companies.find(elemnt => elemnt.id === $event);
  }

  getCompanies() {
    this.http.getActiveCompany().subscribe({
      next: data => {
        this.companies = data;
        
        if(this.roleService.checkPermission([6])){
          this.inputWorkshop.company = this.companies.find(element => element.username === this.roleService.getUserName())!;
        }
      },
      error: err => {
        console.log(err);
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
        console.log(err);
      }
    });
  }

  getTechnologists() {
    this.http.getActiveTechnologist().subscribe({
      next: data => {
        this.technologists = data;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  changeTechnolgist(event: number[]) {
    this.inputWorkshop.requestedTechnologist = event.map(id =>
      this.technologists.find(tech => tech.id === id)!
    );
  }

  changeSelections(event: any, section: number) {
    this.buttonSelect = (section === 0) ? this.buttonSelect.filter(number => Number(number) >= 6 && Number(number) <= 7) : this.buttonSelect.filter(number => Number(number) >= 1 && Number(number) <= 5);
    this.buttonSelect = [...this.buttonSelect, ...event.value]

    this.inputWorkshop.hotelBooking = this.buttonSelect.includes("1");
    this.inputWorkshop.flightBooking = this.buttonSelect.includes("2");
    this.inputWorkshop.trip = this.buttonSelect.includes("3");
    this.inputWorkshop.companyTour = this.buttonSelect.includes("4");
    this.inputWorkshop.meal = this.buttonSelect.includes("5");
    this.inputWorkshop.customerPresent = this.buttonSelect.includes("6");
    this.inputWorkshop.diploma = this.buttonSelect.includes("7");
  }

  postWorkshopRequest() {
    if (this.checkRequired()) {
      this.getNotification(1);
      this.inputWorkshop.showUser = true;
      this.inputWorkshop.reason = "Seminaranmeldung"
      this.inputWorkshop.dateOfCreation = new Date();

      this.http.postWorkshop(this.inputWorkshop).subscribe({
        next: data => {
          this.inputWorkshop = data;

          this.inputWorkshop.techSelection = data.requestedTechnologist!.map(element => element.id!);

          this.buttonSelect = [
            (data.hotelBooking) ? "1" : "",
            (data.flightBooking) ? "2" : "",
            (data.trip) ? "3" : "",
            (data.companyTour) ? "4" : "",
            (data.meal) ? "5" : "",
            (data.customerPresent) ? "6" : "",
            (data.diploma) ? "7" : ""
          ].filter(p => p != "");
        },
        error: err => {
          console.log(err);
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
