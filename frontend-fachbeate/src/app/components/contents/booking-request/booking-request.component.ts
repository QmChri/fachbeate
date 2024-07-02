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
  booking: Booking = {
    flightBookings: []
  };

  constructor(private translate: TranslateService, private http: HttpService, private route: ActivatedRoute,
    private notificationService: NotificationService, public roleService: RoleService) {
  }

  ngOnInit(): void {
    this.addTab()
  }

  postBooking() {
    throw new Error('Method not implemented.');
  }

  changeSelections() {
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
