import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventSourceInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { HttpService } from '../../services/http.service';
import { Identity } from '@fullcalendar/core/internal';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    height: 600,
    eventClick: (arg) => this.handleEventClick(arg),
    events: [],
  };

  constructor(private http: HttpService){

  }

  ngOnInit(): void {
    this.loadEvents();
  }
  
  loadEvents(){
    this.http.getCustomerRequirements().subscribe({
      next: data => { 
        this.calendarOptions.events = data.map(value => ({
          id: ""+value.id,
          title: value.requestedTechnologist!.firstName + " " + value.requestedTechnologist!.lastName,
          start: value.startDate,
          end: value.endDate,
          backgroundColor: value.requestedTechnologist!.color,
          borderColor: value.requestedTechnologist!.color
      }));
      },
      error: err => {
        console.log(err);
        
      }
    })
  }

  handleEventClick(clickInfo: any): void {
    console.log(clickInfo.event.id);
  }
}
