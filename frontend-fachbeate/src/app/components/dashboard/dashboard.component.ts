import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    selectable: true,
    select: (arg) => this.handleDateClick(arg),
    height: 600,
    events: [
      { title: 'Mandi', date: '2024-04-01', },
      { title: 'Fandi', date: '2024-04-02' }
    ],

  };

  handleDateClick(arg: any) {
    alert('date click! ' + arg);
  }
}
