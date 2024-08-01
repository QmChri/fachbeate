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

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  requiredRoles = [1, 2, 4, 5, 7];
  calendarEvnts: CalendarEvent[] = [];

  //Setting the calendar settings
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    height: 850,
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

  constructor(
    private http: HttpService, private router: Router, private dialog: MatDialog,
    public roleService: RoleService
  ) { }

  ngOnInit(): void {
    if (this.roleService.checkPermission(this.requiredRoles)) {
      this.loadDataPerUser();
    }
  }
  //Pull all data that a user is allowed to see
  loadDataPerUser(){
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
    type = (!this.roleService.checkPermission([1,2,5,6,7]) ? 8 : type);

    var fullname: string[] = [this.roleService.getUserName()!, this.roleService.getEmail()!];

    this.http.getCustomerRequirementsByUser(type!, fullname!).subscribe({
      next: data => {
        if(data === null ||data === undefined){
          return
        }

        data.forEach(value => {
          this.calendarEvnts = [...this.calendarEvnts, {
            id: value.id,
            title: value.id+ " "+ value.technologist + " - " + value.name,
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
        if(data === null ||data === undefined){
          return
        }

        data.forEach(value => {
          this.calendarEvnts = [...this.calendarEvnts, {
            id: value.id,
            title: value.id+ " "+ value.technologist + " - " + value.name,
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
        if(data === null ||data === undefined){
          return
        }

        data.forEach(value => {
          this.calendarEvnts = [...this.calendarEvnts, {
            id: value.id,
            title: value.id+ " " + value.name,
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

        if(data === null ||data === undefined){
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
      var appointment: TechnologistAppointment;

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
        if(this.roleService.checkPermission(this.requiredRoles)){
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
