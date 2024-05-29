import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';

import interactionPlugin from '@fullcalendar/interaction';
import { MatDialog } from '@angular/material/dialog';
import { NewDateEntryComponent } from '../contents/new-date-entry/new-date-entry.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {

  customerRequriementIds: string[] = [];
  workshopRequriementIds: string[] = [];

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

  constructor(private http: HttpService,private router: Router, private dialog: MatDialog){

  }

  ngOnInit(): void {
    this.loadEvents();
  }

  
  ngAfterViewInit(): void {


    
    
  }
  
  loadEvents(){
    this.http.getCustomerRequirements().subscribe({
      next: data => { 
        data.forEach(value => {
          this.calendarEvnts = [...this.calendarEvnts, {
            id: ""+value.id,
            title: value.requestedTechnologist!.firstName + " " + value.requestedTechnologist!.lastName + " - " + value.company,
            start: value.startDate,
            end: value.endDate,
            backgroundColor: value.requestedTechnologist!.color,
            borderColor: value.requestedTechnologist!.color,
          }]
        })

        this.customerRequriementIds = data.map(value => ""+value.id);
        this.calendarOptions.events = this.calendarEvnts.map(value => ({
          id: ""+value.id,
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
            id: ""+value.id,
            title: value.requestedTechnologist!.firstName + " " + value.requestedTechnologist!.lastName + " - " + value.company,
            start: value.startDate,
            end: value.endDate,
            backgroundColor: value.requestedTechnologist!.color,
            borderColor: value.requestedTechnologist!.color,
          }]
          
          this.calendarOptions.events = this.calendarEvnts.map(value => ({
            id: ""+value.id,
            title: value.title,
            start: value.start,
            end: value.end,
            backgroundColor: value.backgroundColor,
            borderColor: value.borderColor,
          }));

        })
    
      this.workshopRequriementIds = data.map(value => ""+value.id);
    
    },
      error: err => {
        console.log(err);
      }
    })
  }

  handleSelect(clickInfo: any){
    console.log(clickInfo);
    
    this.openDialog({start: clickInfo.startStr, end: clickInfo.endStr})
  }

  handleEventClick(clickInfo: any): void {
    console.log(this.workshopRequriementIds.includes(clickInfo.event.id))

    if(this.customerRequriementIds.includes(clickInfo.event.id)){
      this.router.navigate(['/customer-requirements', clickInfo.event.id]);
    }else if(this.workshopRequriementIds.includes(clickInfo.event.id)){
      this.router.navigate(['/seminar-registration', clickInfo.event.id]);
    }
  }

  
  openDialog(timeSpan: {start: string, end: string}) {
    const dialogRef = this.dialog.open(NewDateEntryComponent, {
      height: '40rem',
      width: '60rem',
      data: timeSpan
    });
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