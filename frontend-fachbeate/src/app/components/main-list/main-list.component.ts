import { Component } from '@angular/core';
import { elementAt } from 'rxjs';

@Component({
  selector: 'app-main-list',
  templateUrl: './main-list.component.html',
  styleUrls: ['./main-list.component.css']
})
export class MainListComponent {
  searchValue = '';
  visible = false;
  listOfData: DataItem[] = [
    {
      nr: '001',
      createDate: new Date('2021-02-15T09:30:00Z'),
      status: 'open',
      toha: 'Toha A',
      vertreter: 'Vertreter X',
      fachberater: 'Fachberater W',
      timespan: calculateTimeDifference(new Date(2023, 5, 12), new Date(2023, 5, 20)),
      abschlussbericht: false
    },
    {
      nr: '002',
      createDate: new Date('2022-02-15T09:30:00Z'),
      status: 'open',
      toha: 'Toha B',
      vertreter: 'Vertreter W',
      fachberater: 'Fachberater X',
      timespan: calculateTimeDifference(new Date(2022, 5, 12, 2), new Date(2023, 5, 20, 4)),
      abschlussbericht: true
    },
    {
      nr: '003',
      createDate: new Date('2023-03-10T10:45:00Z'),
      status: 'open',
      toha: 'Toha C',
      vertreter: 'Vertreter W',
      fachberater: 'Fachberater W',
      timespan: calculateTimeDifference(new Date(2023, 1, 12, 1), new Date(2023, 5, 20, 1)),
      abschlussbericht: false
    },
    {
      nr: '004',
      createDate: new Date('2024-04-20T11:15:00Z'),
      status: 'in-progress',
      toha: 'Toha A',
      vertreter: 'Vertreter W',
      fachberater: 'Fachberater X',
      timespan: calculateTimeDifference(new Date(2023, 5, 1, 13), new Date(2023, 5, 24, 10)),
      abschlussbericht: true
    }
  ];
  listOfDisplayData = [...this.listOfData];
  listOfColumn = [
    {
      name: 'Kundennummer',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.status.localeCompare(b.status),
      listOfFilter: [
        { text: ' ', value: ' ' },
      ],
      filterFn: null
    },
    {
      name: 'Erstelldatum',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.createDate.valueOf().toString().localeCompare(b.createDate.valueOf().toString()),
      listOfFilter: [
        { text: ' ', value: ' ' },
      ],
      filterFn: null
    },
    {
      name: 'Status',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.status.localeCompare(b.status),
      listOfFilter: [
        { text: 'open', value: 'open' },
        { text: 'in-progress', value: 'in-progress' }
      ],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.status.indexOf(name) !== -1)
    },
    {
      name: 'Händler/Töchter',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.toha.localeCompare(b.toha),
      listOfFilter: [
        { text: 'Toha A', value: 'Toha A' },
        { text: 'Toha B', value: 'Toha B' },
        { text: 'Toha C', value: 'Toha C' },
      ],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.toha.indexOf(name) !== -1)
    },
    {
      name: 'Vertreter',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.vertreter.localeCompare(b.vertreter),
      listOfFilter: [
        { text: 'Vertreter W', value: 'Vertreter W' },
        { text: 'Vertreter X', value: 'Vertreter X' }
      ],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.vertreter.indexOf(name) !== -1)
    },
    {
      name: 'Fachberater',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.fachberater.localeCompare(b.fachberater),
      listOfFilter: [
        { text: 'Fachberater W', value: 'Fachberater W' },
        { text: 'Fachberater X', value: 'Fachberater X' }
      ],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.fachberater.indexOf(name) !== -1)
    },
    {
      name: 'Zeitraum (d/h)',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.timespan.valueOf().toString().localeCompare(b.timespan.valueOf().toString()),
      listOfFilter: [
        { text: ' ', value: ' ' },
      ],
      filterFn: null
    },
    {
      name: 'Abschlussbericht',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.abschlussbericht.valueOf().toString().localeCompare(b.abschlussbericht.valueOf().toString()),
      listOfFilter: [
        { text: 'false', value: 'false' },
        { text: 'true', value: 'true' }
      ],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.abschlussbericht.valueOf().toString().indexOf(name.valueOf().toString()) !== -1)
    },
  ];


  reset(): void {
    this.searchValue = '';
    this.search();
  }

  //TODO hier in jeder Spalte suchen
  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfData.filter((item: DataItem) => item.abschlussbericht.valueOf().toString().indexOf(this.searchValue) !== -1);
  }
}

function calculateTimeDifference(startDate: Date, endDate: Date): TimeSpan {
  const differenceInMilliseconds = endDate.getTime() - startDate.getTime();

  // Convert milliseconds to seconds
  const totalSeconds = Math.floor(differenceInMilliseconds / 1000);

  // Extract days, hours, minutes, and seconds
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

interface DataItem {
  nr: string;
  createDate: Date;
  status: string;
  toha: string;
  vertreter: string;
  fachberater: string;
  timespan: TimeSpan;
  abschlussbericht: boolean;
}
interface TimeSpan {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

