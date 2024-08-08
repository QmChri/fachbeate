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

@Component({
  selector: 'app-booking-request',
  templateUrl: './booking-request.component.html',
  styleUrl: './booking-request.component.scss'
})
export class BookingRequestComponent implements OnInit {
  addItem: string = "";
  costCoverages: string[] = [
    'almiGmbH',
    'almiSubsidiary'
  ];
  buttonSelect: number[] = []
  bookingControl = new FormControl<BookingRequestComponent | null>(null, Validators.required);
  freigegeben: boolean = true;
  bookings: Booking[] = [];
  booking: Booking = {
    flightBookings: []
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
                (data.hotelBooking) ? 4 : -1,
                (data.flightBookingMultiLeg) ? 1 : -1,
                (data.flightBookingRoundTrip) ? 2 : -1,
                (data.trainTicketBooking) ? 3 : -1,
                (data.carRental) ? 5 : -1
              ].filter(p => p != -1);
            }
          },
          error: err => {
            console.log(err);
          }
        });
      }
    });
  }

  checkRequired(): boolean {
    if (!this.booking.flightBookings) {
      this.getNotification(4)
      return false;
    }
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
      this.getNotification(1);
      this.booking.showUser = true;

      this.booking.dateOfCreation = new Date();
      if (this.booking.creator === null || this.booking.creator === undefined) {
        this.booking.creator = this.roleService.getUserName();
      }

      (this.booking.mainStartDate !== null && this.booking.mainStartDate !== undefined) ? this.booking.mainStartDate!.setHours(5) : "";
      (this.booking.mainEndDate !== null && this.booking.mainEndDate !== undefined) ? this.booking.mainEndDate!.setHours(5) : "";
      this.booking.lastEditor = this.booking.lastEditor;

      this.http.postBookingRequest(this.booking).subscribe({
        next: data => {
          this.booking = data;

          this.buttonSelect = [
            (data.hotelBooking) ? 4 : -1,
            (data.flightBookingMultiLeg) ? 1 : -1,
            (data.flightBookingRoundTrip) ? 2 : -1,
            (data.trainTicketBooking) ? 3 : -1,
            (data.carRental) ? 5 : -1
          ].filter(p => p != -1);
        },
        error: err => {
          console.log(err);
        }
      })
    }
  }

  changeSelections(event: any, section: number) {
    this.buttonSelect = (section === 0) ? this.buttonSelect.filter(number => Number(number) >= 6 && Number(number) <= 7) : this.buttonSelect.filter(number => Number(number) >= 1 && Number(number) <= 5);
    this.buttonSelect = [...this.buttonSelect, ...event.value]

    this.booking.flightBookingMultiLeg = this.buttonSelect.includes(1);
    this.booking.flightBookingRoundTrip = this.buttonSelect.includes(2);
    this.booking.trainTicketBooking = this.buttonSelect.includes(3);
    this.booking.hotelBooking = this.buttonSelect.includes(4);
    this.booking.carRental = this.buttonSelect.includes(5);

    if (this.booking.flightBookings === null || this.booking.flightBookingMultiLeg === true || this.booking.flightBookings.length === 0) {
      this.addTab();
    }
  }

  addTab() {
    if (this.booking.flightBookings === null || this.booking.flightBookings === undefined) {
      this.booking.flightBookings = []
    }
    this.booking.flightBookings = [...this.booking.flightBookings, {}]
  }

  deleteLast() {
    if (this.booking.flightBookings.length != 1)
      this.booking.flightBookings.pop();
  }

  addToList(addItem: string) {
    this.costCoverages.push(addItem);
  }

  convertToDate(date: any): Date | undefined {
    return (date !== null && date !== undefined) ? new Date(date.toString()) : undefined;
  }
}
