import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDialog } from '@angular/material/dialog';
import { NewDateEntryComponent } from '../contents/new-date-entry/new-date-entry.component';
import { TechnologistAppointment } from '../../models/technologist-appointment';
import { RoleService } from '../../services/role.service';
import { Company } from '../../models/company';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../services/notification.service';
import multiMonthPlugin from '@fullcalendar/multimonth'

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  requiredRoles = [1, 2, 4, 5, 7];
  calendarEvnts: CalendarEvent[] = [];
  searchValue = '';
  visible = false;
  visible2 = false;
  listOfAdvisor: string[] = [];
  listOfBooking: Array<{ label: string; value: string }> = [
    { label: 'holiday', value: 'Urlaub' },
    { label: 'ausgleich', value: 'Zeitausgleich' },
    { label: 'reservation', value: 'Vorläufige Kundenreservierung' },
    { label: 'fair', value: 'Messe' },
    { label: 'homeF', value: 'HomeOffice' },
    { label: 'houseO', value: 'Haus Oftering' },
    { label: 'filter1', value: 'S_' },
    { label: 'filter2', value: 'F_' },
    { label: 'filter3', value: 'B_' }];
  filterArray: string[] = [];

  //Setting the calendar settings
  calendarOptions: CalendarOptions = {
    //initialView: 'dayGridMonth',
    initialView: 'multiMonthYear',
   // plugins: [dayGridPlugin, interactionPlugin],
    plugins: [multiMonthPlugin, interactionPlugin],
    multiMonthMaxColumns: 5,

    eventClick: (arg) => this.handleEventClick(arg),
    selectable: true,
    select: (arg) => this.handleSelect(arg),
    events: [],
    firstDay: 1,
    displayEventTime: false,
    displayEventEnd: false
  };

  roleServiceUserName = this.roleService.getUserName();
  nameOfCalendarEvent: string = "";
  i: number = 0;

  constructor(public translate: TranslateService, private notificationService: NotificationService,
    private http: HttpService, private router: Router, private dialog: MatDialog,
    public roleService: RoleService
  ) { }

  ngOnInit(): void {
    if (this.roleService.checkPermission(this.requiredRoles)) {
      this.loadDataPerUser();

    } this.loadFilters();
  }

  loadFilters() {
    this.http.getActiveTechnologist().subscribe({
      next: data => {
        this.listOfAdvisor = data.map(element => element.firstName + " " + element.lastName)
      }
    })
  }

  resetBookingFilter() {
    this.searchValue = "";
    this.translate.get('STANDARD.filter_sorting_removed').subscribe((translatedMessage: string) => {
      this.notificationService.createBasicNotification(2, translatedMessage, '', 'topRight');
    });
    this.filterArray = this.filterArray.filter(element => !this.listOfBooking.map(e => e.value).includes(element));
    this.search();
  }

  resetAdvisorFilter() {
    this.searchValue = "";
    this.translate.get('STANDARD.filter_sorting_removed').subscribe((translatedMessage: string) => {
      this.notificationService.createBasicNotification(2, translatedMessage, '', 'topRight');
    });
    this.filterArray = this.filterArray.filter(element => !this.listOfAdvisor.includes(element));
    this.search();

  }

  search(): void {
    if (this.searchValue !== "")
      this.filterArray.push(this.searchValue);

    let tmpEvents = this.calendarEvnts;

    this.filterArray.forEach(element => {
      tmpEvents = tmpEvents.filter(event => {
        return event.title!.includes(element);
      }
      );
    });

    this.calendarOptions.events = tmpEvents.filter(element => {
      return element.title!.includes(this.searchValue);
    }
    ).map(value => ({
      id: value.id,
      title: value.title,
      start: value.start,
      end: value.end,
      backgroundColor: value.backgroundColor,
      borderColor: value.borderColor,
    }));
  }

  //Pull all data that a user is allowed to see
  loadDataPerUser() {
    this.http.getAllCompany().subscribe({
      next: data => {
        var companies = data;

        this.loadEvents(companies)
      }
    })
  }

  loadEvents(companies: Company[]) {
    var type = (this.roleService.checkPermission([1, 2, 3, 5, 7]) ? 7 : 6);
    type = (!this.roleService.checkPermission([1, 2, 3, 5, 6, 7]) ? 4 : type);
    type = (!this.roleService.checkPermission([1, 2, 5, 6, 7]) ? 8 : type);

    var fullname: string[] = [this.roleService.getUserName()!, this.roleService.getEmail()!];

    this.http.getCustomerRequirementsByUser(type!, fullname!).subscribe({
      next: data => {
        if (data === null || data === undefined) {
          return
        }

        data.forEach(value => {
          this.calendarEvnts = [...this.calendarEvnts, {
            id: value.id,
            title: value.id + " " + value.technologist + " - " + value.name,
            start: new Date(value.fromDate),
            end: new Date(value.toDate),
            backgroundColor: value.calendarColor,
            borderColor: value.calendarColor,
          }]
        })

        this.calendarOptions.events = this.calendarEvnts.map(value => ({
          id: value.id,
          title: value.title,
          start: value.start,
          end: value.end,
          backgroundColor: value.backgroundColor,
          borderColor: value.borderColor,
        }));
      },
      error: err => {
        console.log(err);
      }
    });

    this.http.getWorkshopByUser(type, fullname!).subscribe({
      next: data => {
        if (data === null || data === undefined) {
          return
        }

        data.forEach(value => {
          this.calendarEvnts = [...this.calendarEvnts, {
            id: value.id,
            title: value.id + " " + value.technologist + " - " + value.name,
            start: new Date(value.fromDate),
            end: new Date(value.toDate),
            backgroundColor: value.calendarColor,
            borderColor: value.calendarColor,
          }]

          this.calendarOptions.events = this.calendarEvnts.map(value => ({
            id: value.id,
            title: value.title,
            start: value.start,
            end: value.end,
            backgroundColor: value.backgroundColor,
            borderColor: value.borderColor,
          }));

        })

      },
      error: err => {
        console.log(err);
      }
    });

    this.http.getVisitorRegistrationByUser(type, fullname!).subscribe({
      next: data => {
        if (data === null || data === undefined) {
          return
        }

        data.forEach(value => {
          this.calendarEvnts = [...this.calendarEvnts, {
            id: value.id,
            title: value.id + " " + value.name,
            start: new Date(value.fromDate),
            end: new Date(value.toDate),
            backgroundColor: value.calendarColor,
            borderColor: value.calendarColor,
          }]

          this.calendarOptions.events = this.calendarEvnts.map(value => ({
            id: value.id,
            title: value.title,
            start: value.start,
            end: value.end,
            backgroundColor: value.backgroundColor,
            borderColor: value.borderColor,
          }));

        })

      },
      error: err => {
        console.log(err);
      }
    })


    this.http.getOtherAppointmentByUser(type, fullname!).subscribe({
      next: data => {

        if (data === null || data === undefined) {
          return
        }
        data.forEach(value => {
          this.calendarEvnts = [...this.calendarEvnts, {
            id: "o" + value.id,
            title: value.requestedTechnologist!.firstName + " " + value.requestedTechnologist!.lastName + " - " + value.reason,
            start: value.startDate,
            end: value.endDate,
            backgroundColor: value.requestedTechnologist!.color,
            borderColor: value.requestedTechnologist!.color,
          }]
        })
        this.calendarOptions.events = this.calendarEvnts.map(value => ({
          id: value.id,
          title: value.title,
          start: value.start,
          end: value.end,
          backgroundColor: value.backgroundColor,
          borderColor: value.borderColor,
        }));
      },
      error: err => {
        console.log(err);
      }
    })

  }

  handleSelect(clickInfo: any) {
    this.openDialog({ startDate: new Date(clickInfo.startStr), endDate: new Date(clickInfo.endStr) })
  }

  // When a calendar event is pressed
  handleEventClick(clickInfo: any): void {
    /** As the IDs for the 3 requirements start at 1, a distinction must
     *  be made as to which event is clicked on. Hence the F, S, B distinctions
     * */
    if (clickInfo.event.id.substring(0, 1) === "F") {
      this.router.navigate(['/customer-requirements', clickInfo.event.id.substring(2)]);
    } else if (clickInfo.event.id.substring(0, 1) === "S") {
      this.router.navigate(['/seminar-registration', clickInfo.event.id.substring(2)]);
    } else if (clickInfo.event.id.substring(0, 1) === "B") {
      this.router.navigate(['/visitor-registration', clickInfo.event.id.substring(2)]);
    } else {
      this.http.getOtherAppointmentById(Number(clickInfo.event.id.substring(1))).subscribe({
        next: data => {
          this.openDialog(data);
        },
        error: err => {
          console.log(err);
        }
      });
    }
  }

  openDialog(timeSpan: TechnologistAppointment) {
    timeSpan.startDate = new Date(timeSpan.startDate!)
    timeSpan.endDate = new Date(timeSpan.endDate!)

    const dialogRef = this.dialog.open(NewDateEntryComponent, {
      height: '31rem',
      width: '25rem',
      data: timeSpan
    });

    dialogRef.afterClosed().subscribe(
      data => {
        if (this.roleService.checkPermission(this.requiredRoles)) {
          this.loadDataPerUser()
        }
      });
  }
}

interface CalendarEvent {
  id?: string,
  title?: string,
  start?: Date,
  end?: Date,
  backgroundColor?: string,
  borderColor?: string
}
