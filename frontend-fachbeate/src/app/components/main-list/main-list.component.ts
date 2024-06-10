import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { Technologist } from '../../models/technologist';
import { TranslateService } from '@ngx-translate/core';
import { DateLocale } from 'ng-zorro-antd/i18n';

@Component({
  selector: 'app-main-list',
  templateUrl: './main-list.component.html',
  styleUrls: ['./main-list.component.css']
})
export class MainListComponent implements OnInit{
  searchValue = '';
  visible = false;
  listOfData: DataItem[] = [];

  technologistList: Technologist[] = [];

  //TODO bei listOfFilter gehören jeweils die richtigen text und values von der liste hereingeladen
  listOfDisplayData: DataItem[] = [];
  listOfColumn: ColumnDefinition[]  = [
    {
      name: 'customerNr',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.nr.toString().localeCompare(b.nr.toString()),
      listOfFilter: [
        { text: ' ', value: ' ' },
      ],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'creationDate',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.createDate.valueOf().toString().localeCompare(b.createDate.valueOf().toString()),
      listOfFilter: [
        { text: ' ', value: ' ' },
      ],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'state',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.status.localeCompare(b.status),
      listOfFilter: [
        { text: 'open', value: 'open' },
        { text: 'in-progress', value: 'in-progress' }
      ],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.status.indexOf(name) !== -1)
    },
    {
      name: 'dealers',
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
      name: 'representative',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.vertreter.localeCompare(b.vertreter),
      listOfFilter: [
        { text: ' ', value: ' ' }
      ],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.vertreter.indexOf(name) !== -1)
    },
    {
      name: 'technologist',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.fachberater.localeCompare(b.fachberater),
      listOfFilter: [
        { text: '', value: '' }
      ],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.fachberater.indexOf(name) !== -1)
    },
    {
      name: 'time-frame',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.timespan.valueOf().toString().localeCompare(b.timespan.valueOf().toString()),
      listOfFilter: [
        { text: ' ', value: ' ' },
      ],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'final-report',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.abschlussbericht.valueOf().toString().localeCompare(b.abschlussbericht.valueOf().toString()),
      listOfFilter: [
        { text: 'erledigt', value: 'true' },
        { text: 'nicht erledigt', value: 'false' }
      ],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.abschlussbericht.valueOf().toString().indexOf(name.valueOf().toString()) !== -1)
    },
  ];


  constructor(private router: Router, private http: HttpService, private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){

    this.loadTechnologists();

    this.http.getCustomerRequirements().subscribe({
      next: data => {
        data.forEach(element => {

          var tmpStatus = "in-progress";
          if((element.releaseManagement != null && element.releaseManagement != undefined)
            || (element.releaseSupervisor != null && element.releaseSupervisor != undefined)){
              tmpStatus = "open";
          }

          var allFinalReports: boolean = true;

          element.customerVisits.forEach(element => {if(element.finalReport === undefined || element.finalReport === null){allFinalReports === false}});

          this.listOfData = [...this.listOfData, {
            nr: element.id!,
            createDate: new Date(),
            status: "ToDo",
            toha: element.company!,
            vertreter: element.representative!.firstName + " " + element.representative!.lastName,
            fachberater: element.requestedTechnologist!.firstName + " " + element.requestedTechnologist!.lastName,
            timespan: {
              start: element.startDate,
              end: element.endDate
            }, abschlussbericht: allFinalReports,
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
          if((element.releaseManagement != null && element.releaseManagement != undefined)
            || (element.releaseSupervisor != null && element.releaseSupervisor != undefined)){
              tmpStatus = "open";
          }

          console.log(new Date(element.endDate!).toDateString());


          this.listOfData = [...this.listOfData, {
            nr: element.id!,
            createDate: new Date(),
            status: "ToDo",
            toha: element.company!,
            vertreter: element.seminarPresenter!,
            fachberater: element.requestedTechnologist!.firstName + " " + element.requestedTechnologist!.lastName,
            timespan: {
              start: element.startDate,
              end: element.endDate
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

  loadTechnologists(){
    this.http.getAllTechnologist().subscribe({
      next: data => { this.technologistList = data },
      error: err => {
        console.log(err);
      }
    })
  }

  openCRC(dateNr: number, type: number) {
    if(type === 0){
      this.router.navigate(['/customer-requirements', dateNr]);
    }else if(type === 1){
      this.router.navigate(['/seminar-registration', dateNr]);
    }

    console.log('Selected Field:', dateNr);
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
        var tmp: {text: string; value: string}[] = [];

        this.technologistList.forEach(technolgist => {
          tmp = [...tmp, {text: technolgist.firstName + " " + technolgist.lastName, value: technolgist.firstName + " " + technolgist.lastName}]
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
      item.nr.toString().indexOf(this.searchValue.toLocaleLowerCase()) !== -1 ||
      item.createDate.valueOf().toString().indexOf(this.searchValue.valueOf().toString()) !== -1 ||
      item.status.toLocaleLowerCase().indexOf(this.searchValue.toLocaleLowerCase()) !== -1 ||
      item.toha.toLocaleLowerCase().indexOf(this.searchValue.toLocaleLowerCase()) !== -1 ||
      item.vertreter.toLocaleLowerCase().indexOf(this.searchValue.toLocaleLowerCase()) !== -1 ||
      item.fachberater.toLocaleLowerCase().indexOf(this.searchValue.toLocaleLowerCase()) !== -1 ||
      item.timespan.valueOf().toString().indexOf(this.searchValue.valueOf().toString()) !== -1 ||
      item.abschlussbericht.toString().indexOf(this.searchValue.toString()) !== -1
    ));
  }
}

interface DataItem {
  nr: number;
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
  start?: Date;
  end?: Date;
}

interface ColumnDefinition {
  name: string;
  sortOrder: any;
  sortFn: (a: DataItem, b: DataItem) => number;
  listOfFilter: {text: string, value: string}[];
  filterFn?: (list: string[], item: DataItem) => boolean;
}
