import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { RoleService } from '../../../services/role.service';
import { HttpService } from '../../../services/http.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Booking } from '../../../models/booking';
import { CheckDialogComponent } from '../check-dialog/check-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { log } from '../../../app.module';

@Component({
  selector: 'app-booking-request',
  templateUrl: './booking-request.component.html',
  styleUrl: './booking-request.component.scss'
})
export class BookingRequestComponent implements OnInit {
  addItem: string = "";
  fileList: NzUploadFile[] = [];
  costCoverages: string[] = [
    'almiGmbH',
    'almiSubsidiary'
  ];
  buttonSelect: String[] = []
  bookingControl = new FormControl<BookingRequestComponent | null>(null, Validators.required);
  freigegeben: boolean = true;
  booking: Booking = {
    flights: []
  };


  constructor(private dialog: MatDialog, private translate: TranslateService, private http: HttpService, private route: ActivatedRoute,
    private notificationService: NotificationService, public roleService: RoleService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get('id') != null) {
        this.http.getBookingById(parseInt(params.get('id')!)).subscribe({
          next: data => {
            if (data != null) {
              this.booking = data;

              this.booking.mainStartDate = this.convertToDate(this.booking.mainStartDate);
              this.booking.mainEndDate = this.convertToDate(this.booking.mainEndDate);

              this.buttonSelect = [
                (data.hotelBooking) ? "4" : "",
                (data.flightBookingMultiLeg) ? "1" : "",
                (data.flightBookingRoundTrip) ? "2" : "",
                (data.trainTicketBooking) ? "3" : "",
                (data.carRental) ? "5" : ""
              ].filter(p => p != "");
            }
          },
          error: err => {
            log("booking-request: ", err)
          }
        });
      }
    });
  }


  checkRequired(): boolean {
    //TODO
    return true;
  }

  release(department: string) {
    if (department === 'gl' && this.checkRequired()) {
      this.getNotification(2);
      this.booking.releaseManagement = new Date();
      this.booking.releaserManagement = this.roleService.getUserName()
      this.postBooking();
    }
    else if (department === 'al' && this.checkRequired()) {
      this.getNotification(3);
      this.booking.releaseSupervisor = new Date();
      this.booking.releaserSupervisor = this.roleService.getUserName()
      this.postBooking();
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
      case 4: { //Files hochgeladen
        this.translate.get('ABSCHLUSSBERICHT.files_uploaded').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(0, translatedMessage, '', 'topRight');
        });
        break;
      }
      case 5: { //Files nicht erlaubt
        this.translate.get(['ABSCHLUSSBERICHT.files_allowed', 'ABSCHLUSSBERICHT.files_allowed_2'])
          .subscribe((translations: { [key: string]: string }) => {
            const message1 = translations['ABSCHLUSSBERICHT.files_allowed'];
            const message2 = translations['ABSCHLUSSBERICHT.files_allowed_2'];
            this.notificationService.createBasicNotification(4, message1, message2, 'topRight');
          });
        break;
      }
      case 6: { // maximal 5 Files
        this.translate.get(['ABSCHLUSSBERICHT.files_count', 'ABSCHLUSSBERICHT.files_count_2'])
          .subscribe((translations: { [key: string]: string }) => {
            const message1 = translations['ABSCHLUSSBERICHT.files_count'];
            const message2 = translations['ABSCHLUSSBERICHT.files_count_2'];
            this.notificationService.createBasicNotification(4, message1, message2, 'topRight');
          });
        break;
      }
      case 7: { //maximal 2 MB per file
        this.translate.get(['ABSCHLUSSBERICHT.files_size', 'ABSCHLUSSBERICHT.files_size_2'])
          .subscribe((translations: { [key: string]: string }) => {
            const message1 = translations['ABSCHLUSSBERICHT.files_size'];
            const message2 = translations['ABSCHLUSSBERICHT.files_size_2'];
            this.notificationService.createBasicNotification(4, message1, message2, 'topRight');
          });
        break;
      }
      /*case 4: { // Pflichtfelder ausfüllen
        
        this.translate.get(['STANDARD.please_fill_required_fields', 'STANDARD.assigned_representative']).subscribe(translations => {
          const message = translations['STANDARD.please_fill_required_fields'];
          const anotherMessage = translations['STANDARD.assigned_representative'];
          this.notificationService.createBasicNotification(4, message, anotherMessage, 'topRight');
        }); break;
      } */
    }
  }

  checkPopup() {
    //if (this.checkRequired()) {
    const dialogRef = this.dialog.open(CheckDialogComponent, {
      width: '50%',
      data: 3
    });

    dialogRef.afterClosed().subscribe(
      data => {
        if (data === true) {
          this.postBooking();
        }
      });
    // }
  }

  postBooking() {
    if (this.checkRequired()) {
      if (this.booking.id === null || this.booking.id === undefined || this.booking.id === 0) {
        this.booking.dateOfCreation = new Date();
        this.booking.creator = this.roleService.getUserName();
      }
      this.booking.lastEditor = this.roleService.getUserName();

      this.getNotification(1);
      this.booking.showUser = true;

      (this.booking.mainStartDate !== null && this.booking.mainStartDate !== undefined) ? this.booking.mainStartDate!.setHours(5) : "";
      (this.booking.mainEndDate !== null && this.booking.mainEndDate !== undefined) ? this.booking.mainEndDate!.setHours(5) : "";
      this.booking.lastEditor = this.booking.lastEditor;
      console.log(this.booking);

      this.http.postBookingRequest(this.booking).subscribe({
        next: data => {
          this.booking = data;

          this.buttonSelect = [
            (data.hotelBooking) ? "4" : "",
            (data.flightBookingMultiLeg) ? "1" : "",
            (data.flightBookingRoundTrip) ? "2" : "",
            (data.trainTicketBooking) ? "3" : "",
            (data.carRental) ? "5" : ""
          ].filter(p => p != "");
        },
        error: err => {
          log("booking-request: ", err)
        }
      })
    }
  }

  changeSelections() {
    this.booking.flightBookingMultiLeg = this.buttonSelect.includes("1");
    this.booking.flightBookingRoundTrip = this.buttonSelect.includes("2");
    this.booking.trainTicketBooking = this.buttonSelect.includes("3");
    this.booking.hotelBooking = this.buttonSelect.includes("4");
    this.booking.carRental = this.buttonSelect.includes("5");


    if (this.booking.flightBookingMultiLeg && this.booking.flights.length === 0) {
      this.addTab();
    }
  }

  addTab() {
    this.booking.flights = [...this.booking.flights, {}]
  }

  deleteLast() {
    if (this.booking.flights.length > 1)
      this.booking.flights.pop();
  }

  addToList(addItem: string) {
    this.costCoverages.push(addItem);
  }

  convertToDate(date: any): Date | undefined {
    return (date !== null && date !== undefined) ? new Date(date.toString()) : undefined;
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    const icCorrectFileType = file.type === 'application/pdf' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/heif';
    const isLt2M = file.size! / 1024 / 1024 < 1;

    if (!icCorrectFileType) {
      this.getNotification(5);
      return false;
    }
    if (this.fileList.length >= 5) {
      this.getNotification(6);
      return false;
    }
    if (!isLt2M) {
      this.getNotification(7);
      return false;
    }
    // Datei zur Liste hinzufügen
    this.fileList = [...this.fileList, file];
    this.getNotification(4);
    return true;
  };

  handleChange(info: { fileList: NzUploadFile[] }): void {
    const fileList = info.fileList.slice(-10);
    this.fileList = fileList;
  }
}
