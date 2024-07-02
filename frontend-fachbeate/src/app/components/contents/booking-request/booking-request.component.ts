import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { RoleService } from '../../../services/role.service';
import { HttpService } from '../../../services/http.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Booking } from '../../../models/booking';

@Component({
  selector: 'app-booking-request',
  templateUrl: './booking-request.component.html',
  styleUrl: './booking-request.component.scss'
})
export class BookingRequestComponent implements OnInit {
  bookingControl = new FormControl<BookingRequestComponent | null>(null, Validators.required);
  buttonSelect: String[] = []
  freigegeben: boolean = true;
  booking: Booking = {
    flightBookings: []
  };

  constructor(private translate: TranslateService, private http: HttpService, private route: ActivatedRoute,
    private notificationService: NotificationService, public roleService: RoleService) {
  }

  ngOnInit(): void {
    this.addTab()
  }

  checkRequired(): boolean {
    if (!this.booking.flightBooking) {
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
      case 4: { // Pflichtfelder ausfüllen
        this.translate.get(['STANDARD.please_fill_required_fields', 'STANDARD.assigned_representative']).subscribe(translations => {
          const message = translations['STANDARD.please_fill_required_fields'];
          const anotherMessage = translations['STANDARD.assigned_representative'];
          this.notificationService.createBasicNotification(4, message, anotherMessage, 'topRight');
        }); break;
      }
    }
  }

  postBooking() {
    if (this.checkRequired()) {
      this.getNotification(1);
      throw new Error('Method not implemented.');
    }
  }

  changeSelections(event: any, section: number) {
    this.buttonSelect = (section === 0) ? this.buttonSelect.filter(number => Number(number) >= 6 && Number(number) <= 7) : this.buttonSelect.filter(number => Number(number) >= 1 && Number(number) <= 5);
    this.buttonSelect = [...this.buttonSelect, ...event.value]

    this.booking.flightBooking = this.buttonSelect.includes("1");
    this.booking.forkFlightBooking = this.buttonSelect.includes("2");
    this.booking.trainTicket = this.buttonSelect.includes("3");
    this.booking.hotelBooking = this.buttonSelect.includes("4");
    this.booking.carRenting = this.buttonSelect.includes("5");
  }

  addTab() {
    this.booking.flightBookings = [...this.booking.flightBookings, {}]
  }

  deleteLast() {
    if (this.booking.flightBookings.length != 1)
      this.booking.flightBookings.pop();
  }
}
