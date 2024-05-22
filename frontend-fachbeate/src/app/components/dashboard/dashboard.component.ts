import { Component, ElementRef, OnInit } from '@angular/core';
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
export class DashboardComponent implements OnInit {

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
  
  loadEvents(){
    this.http.getCustomerRequirements().subscribe({
      next: data => { 
        this.calendarOptions.events = data.map(value => ({
          id: ""+value.id,
          title: value.requestedTechnologist!.firstName + " " + value.requestedTechnologist!.lastName + " - " + value.company,
          start: value.startDate,
          end: value.endDate,
          backgroundColor: value.requestedTechnologist!.color,
          borderColor: value.requestedTechnologist!.color,
      }));
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
    this.router.navigate(['/customer-requirements', clickInfo.event.id]);
  }

  
  openDialog(timeSpan: {start: string, end: string}) {
    const dialogRef = this.dialog.open(NewDateEntryComponent, {
      height: '40rem',
      width: '60rem',
      data: timeSpan
    });
  }
  
}
