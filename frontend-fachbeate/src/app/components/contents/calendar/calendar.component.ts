import { Component, ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    selectable: true,
    select: (arg) => this.handleDateClick(arg),
    events: [
      { title: 'Mandi', date: '2024-04-01', },
      { title: 'Fandi', date: '2024-04-02' }
    ],

  };

  handleDateClick(arg: any) {
    alert('date click! ' + arg);
  }


}
