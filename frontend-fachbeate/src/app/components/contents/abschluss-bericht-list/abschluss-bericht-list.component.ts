import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { FinalReport } from '../../../models/final-report';

@Component({
  selector: 'app-abschluss-bericht-list',
  templateUrl: './abschluss-bericht-list.component.html',
  styleUrl: './abschluss-bericht-list.component.scss'
})
export class AbschlussBerichtListComponent { //implements OnInit
 /* searchValue = '';
  visible = false;
  listOfData: DataItem[] = [];

  abschlussList: FinalReport[] = [];

  listOfDisplayData: DataItem[] = [];
  listOfColumn: ColumnDefinition[] = [
    {
      name: 'Kundennummer',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.customerNr.toString().localeCompare(b.customerNr.toString()),
      listOfFilter: [
        { text: ' ', value: ' ' },
      ],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'Datum Kundenbesuch',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.dateOfVisit.valueOf().toString().localeCompare(b.dateOfVisit.valueOf().toString()),
      listOfFilter: [
        { text: ' ', value: ' ' },
      ],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'Erstelldatum',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.createDate.valueOf().toString().localeCompare(b.createDate.valueOf().toString()),
      listOfFilter: [
        { text: 'open', value: 'open' },
        { text: 'in-progress', value: 'in-progress' }
      ],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.status.indexOf(name) !== -1)
    },
    {
      name: 'Zuständiger Technologe',
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
      name: 'Zu erledigen bis (Technologe)',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.vertreter.localeCompare(b.vertreter),
      listOfFilter: [
        { text: ' ', value: ' ' }
      ],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.vertreter.indexOf(name) !== -1)
    },
    {
      name: 'Zuständiger Vertreter',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.fachberater.localeCompare(b.fachberater),
      listOfFilter: [
        { text: '', value: '' }
      ],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.fachberater.indexOf(name) !== -1)
    },
    {
      name: 'Zu erledigen bis (Vertreter)',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.timespan.valueOf().toString().localeCompare(b.timespan.valueOf().toString()),
      listOfFilter: [
        { text: ' ', value: ' ' },
      ],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'Fertigstellt',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.abschlussbericht.valueOf().toString().localeCompare(b.abschlussbericht.valueOf().toString()),
      listOfFilter: [
        { text: 'erledigt', value: 'true' },
        { text: 'nicht erledigt', value: 'false' }
      ],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.abschlussbericht.valueOf().toString().indexOf(name.valueOf().toString()) !== -1)
    },
  ];

  constructor(private router: Router, private http: HttpService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loadTechnologists();

    this.http.getCustomerRequirements().subscribe({
      next: data => {
        data.forEach(element => {

          var tmpStatus = "in-progress";
          if ((element.releaseManagement != null && element.releaseManagement != undefined)
            || (element.releaseSupervisor != null && element.releaseSupervisor != undefined)) {
            tmpStatus = "open";
          }

          console.log(new Date(element.endDate!).toDateString());


          this.listOfData = [...this.listOfData, {
            customerNr: element.nr!,
            dateOfVisit: element.dateOfVisit!,
            createDate: new Date(),
            status: "ToDo",
            toha: element.company!,
            vertreter: element.representative!,
            fachberater: element.requestedTechnologist!.firstName + " " + element.requestedTechnologist!.lastName,
            timespan: {
              days: Math.round(Math.abs(new Date(element.endDate!).getTime() - new Date(element.startDate!).getTime()) / 86400000),
              hours: 0,
              minutes: 0,
              seconds: 0
            },
            abschlussbericht: false,
            type: 0
          }];
        });

        this.resetFilters()

        this.listOfDisplayData = [...this.listOfData];
      },
      error: err => {

      }
    });

    this.http.getWorkshopRequirements().subscribe({
      next: data => {
        data.forEach(element => {

          var tmpStatus = "in-progress";
          if ((element.releaseManagement != null && element.releaseManagement != undefined)
            || (element.releaseSupervisor != null && element.releaseSupervisor != undefined)) {
            tmpStatus = "open";
          }

          console.log(new Date(element.endDate!).toDateString());


          this.listOfData = [...this.listOfData, {
            customerNr: element.id!,
            createDate: new Date(),
            status: "ToDo",
            toha: element.company!,
            vertreter: element.seminarPresenter!,
            fachberater: element.requestedTechnologist!.firstName + " " + element.requestedTechnologist!.lastName,
            timespan: {
              days: Math.round(Math.abs(new Date(element.endDate!).getTime() - new Date(element.startDate!).getTime()) / 86400000),
              hours: 0,
              minutes: 0,
              seconds: 0
            },
            abschlussbericht: false,
            type: 1
          }];

        });

        this.resetFilters()

        this.listOfDisplayData = [...this.listOfData];
      },
      error: err => {

      }
    });

  }

  loadTechnologists() {
    this.http.getAllTechnologist().subscribe({
      next: data => { this.abschlussList = data },
      error: err => {
        console.log(err);
      }
    })
  }

  resetFilters(): void {
    this.listOfColumn.forEach(item => {
      if (item.name === 'Status') {
        item.listOfFilter = [
          { text: 'open', value: 'open' },
          { text: 'in-progress', value: 'in-progress' }
        ];
      } else if (item.name === 'Händler/Töchter') {
        item.listOfFilter = [
          { text: 'Toha A', value: 'Toha A' },
          { text: 'Toha B', value: 'Toha B' },
          { text: 'Toha C', value: 'Toha C' }
        ];
      } else if (item.name === 'Vertreter') {
        item.listOfFilter = [
          { text: 'Vertreter W', value: 'Vertreter W' },
          { text: 'Vertreter X', value: 'Vertreter X' }
        ];
      } else if (item.name === 'Fachberater') {
        var tmp: { text: string; value: string }[] = [];

        this.abschlussList.forEach(technolgist => {
          tmp = [...tmp, { text: technolgist.company + " " + technolgist.company, value: technolgist.company + " " + technolgist.company }]
        })

        item.listOfFilter! = tmp;
      } else if (item.name === 'Abschlussbericht') {
        item.listOfFilter = [
          { text: 'erledigt', value: 'true' },
          { text: 'nicht erledigt', value: 'false' }
        ];
      }
    });
  }

  resetSortAndFilters(): void {
    this.listOfColumn.forEach(item => {
      item.sortOrder = null;
    });
    this.resetFilters();
    this.searchValue = '';
    this.search();
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfData.filter((item: DataItem) =>
    (
      item.customerNr.toString().indexOf(this.searchValue.toLocaleLowerCase()) !== -1 ||
      item.dateOfVisit.valueOf().toString().indexOf(this.searchValue.valueOf().toString()) !== -1 ||
      item.createDate.valueOf().toString().indexOf(this.searchValue.valueOf().toString()) !== -1 ||
      item.status.toLocaleLowerCase().indexOf(this.searchValue.toLocaleLowerCase()) !== -1 ||
      item.toha.toLocaleLowerCase().indexOf(this.searchValue.toLocaleLowerCase()) !== -1 ||
      item.vertreter.toLocaleLowerCase().indexOf(this.searchValue.toLocaleLowerCase()) !== -1 ||
      item.fachberater.toLocaleLowerCase().indexOf(this.searchValue.toLocaleLowerCase()) !== -1 ||
      item.timespan.valueOf().toString().indexOf(this.searchValue.valueOf().toString()) !== -1 ||
      item.abschlussbericht.toString().indexOf(this.searchValue.toString()) !== -1
    ));
  }
  */
}

interface DataItem {
  customerNr: number;
  dateOfVisit: Date;
  createDate: Date;
  status: string;
  toha: string;
  vertreter: string;
  fachberater: string;
  timespan: TimeSpan;
  abschlussbericht: boolean;
  type: number;
}

interface TimeSpan {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface ColumnDefinition {
  name: string;
  sortOrder: any;
  sortFn: (a: DataItem, b: DataItem) => number;
  listOfFilter: { text: string, value: string }[];
  filterFn?: (list: string[], item: DataItem) => boolean;
}
