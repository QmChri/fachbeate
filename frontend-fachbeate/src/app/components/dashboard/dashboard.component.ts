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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  requiredRoles = [1,2,4,5];
  calendarEvnts: CalendarEvent[] = [];
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    height: 600,
    eventClick: (arg) => this.handleEventClick(arg),
    selectable: true,
    select: (arg) => this.handleSelect(arg),
    events: [],
    firstDay: 1,
  };

  constructor(
    private http: HttpService,private router: Router, private dialog: MatDialog,
    public roleService: RoleService
  ){}

  ngOnInit(): void {
    if(this.roleService.checkPermission(this.requiredRoles)) {
      this.loadEvents();
    }
  }

  loadEvents(){
    
    this.http.getCustomerRequirements().subscribe({
      next: data => {        
        data.forEach(value => {
          this.calendarEvnts = [...this.calendarEvnts, {
            id: "c"+value.id,
            title: value.requestedTechnologist!.firstName + " " + value.requestedTechnologist!.lastName + " - " + value.company!.name,
            start: value.startDate,
            end: this.adjustEndDate(value.endDate!.toString()),
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

    this.http.getWorkshopRequirements().subscribe({
      next: data => {
        data.forEach(value => {
          this.calendarEvnts = [...this.calendarEvnts, {
            id: "w"+value.id,
            title: value.requestedTechnologist![0].firstName + " " + value.requestedTechnologist![0].lastName + " - " + value.company,
            start: value.startDate,
            end: this.adjustEndDate(value.endDate!.toString()),
            backgroundColor: value.requestedTechnologist![0].color,
            borderColor: value.requestedTechnologist![0].color,
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

    this.http.getOtherAppointments().subscribe({
      next: data => {
        data.forEach(value => {
          this.calendarEvnts = [...this.calendarEvnts, {
            id: "o"+value.id,
            title: value.requestedTechnologist!.firstName + " " + value.requestedTechnologist!.lastName + " - " + value.reason,
            start: value.startDate,
            end: this.adjustEndDate(value.endDate!.toString()),
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

  handleSelect(clickInfo: any){
    this.openDialog({startDate: new Date(clickInfo.startStr), endDate: new Date(clickInfo.endStr)})
  }
  
  handleEventClick(clickInfo: any): void {   
    if(clickInfo.event.id.substring(0,1) === "c"){
      this.router.navigate(['/customer-requirements', clickInfo.event.id.substring(1)]);
    }else if(clickInfo.event.id.substring(0,1) === "w"){
      this.router.navigate(['/seminar-registration', clickInfo.event.id.substring(1)]);
    }else{
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
        this.loadEvents()
      });
  }

  adjustEndDate(endDate: string): Date {
    const date = new Date(endDate);
    //date.setDate(date.getDate() + 1);
    date.setHours(5)
    return new Date(date.toISOString().split('T')[0]);
  }
}

interface CalendarEvent{
    id?: string,
    title?: string,
    start?: Date,
    end?: Date,
    backgroundColor?: string,
    borderColor?: string
}
