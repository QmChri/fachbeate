import { Component, ViewChild } from '@angular/core';
import {DayPilot, DayPilotCalendarComponent} from "@daypilot/daypilot-lite-angular";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  @ViewChild("calendar") calendar!: DayPilotCalendarComponent;

  events: DayPilot.EventData[] = [];

  configCalendar: DayPilot.CalendarConfig = {
    viewType: "Week",
    onTimeRangeSelected: async (args) => {
      const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
      const dp = args.control;
      dp.clearSelection();
      if (!modal.result) { return; }
      dp.events.add(new DayPilot.Event({
        start: args.start,
        end: args.end,
        id: DayPilot.guid(),
        text: modal.result
      }));
    }
  };

  constructor() {
  }

  ngAfterViewInit(): void {
  }

}
