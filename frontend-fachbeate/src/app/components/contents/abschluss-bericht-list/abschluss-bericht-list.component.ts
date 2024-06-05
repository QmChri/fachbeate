import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { FinalReport } from '../../../models/final-report';
import { Technologist } from '../../../models/technologist';

@Component({
  selector: 'app-abschluss-bericht-list',
  templateUrl: './abschluss-bericht-list.component.html',
  styleUrl: './abschluss-bericht-list.component.scss'
})
export class AbschlussBerichtListComponent { //implements OnInit
  searchValue = '';
  visible = false;
  listOfData: DataItem[] = [];

  technologistList: Technologist[] = [];

  listOfDisplayData: DataItem[] = [];

  listOfColumn: ColumnDefinition[]  = [
    {
      name: 'Kunde',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.company.toString().localeCompare(b.company.toString()),
      listOfFilter: [
        { text: ' ', value: ' ' },
      ],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'Datum Kundenbesuch',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.dateOfVisit.toString().localeCompare(b.dateOfVisit.toString()),
      listOfFilter: [
        { text: ' ', value: ' ' },
      ],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'Erstelldatum Besuch',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.creationDate.localeCompare(b.creationDate),
      listOfFilter: [
        { text: 'open', value: 'open' },
        { text: 'in-progress', value: 'in-progress' }
      ],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.creationDate.indexOf(name) !== -1)
    },
    {
      name: 'Zuständiger Technologe',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.technologist.localeCompare(b.technologist),
      listOfFilter: [
        { text: 'Toha A', value: 'Toha A' },
        { text: 'Toha B', value: 'Toha B' },
        { text: 'Toha C', value: 'Toha C' },
      ],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.technologist.indexOf(name) !== -1)
    },
    {
      name: '\"Zu Erledigen\" - Technologe',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.dateOfReworkTechnologist.localeCompare(b.dateOfReworkTechnologist),
      listOfFilter: [
        { text: ' ', value: ' ' }
      ],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.dateOfReworkTechnologist.indexOf(name) !== -1)
    },
    {
      name: 'Zuständiger Vertreter',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.representative.localeCompare(b.representative),
      listOfFilter: [
        { text: '', value: '' }
      ],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.representative.indexOf(name) !== -1)
    },
    {
      name: '\"Zu Erledigen\" - Vertreter',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.dateOfReworkRepresentative.localeCompare(b.dateOfReworkRepresentative),
      listOfFilter: [
        { text: ' ', value: ' ' },
      ],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'Status',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.state.localeCompare(b.state),
      listOfFilter: [
        { text: 'erledigt', value: 'true' },
        { text: 'nicht erledigt', value: 'false' }
      ],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.state.indexOf(name.valueOf().toString()) !== -1)
    },
  ];


  constructor(private router: Router, private http: HttpService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){

    this.loadTechnologists();

    this.http.getFinalReports().subscribe({
      next: data => {
        data.forEach(element => {
          this.listOfData = [...this.listOfData,{
            company: element.company!,
            dateOfVisit: element.dateOfVisit!.toString().substring(10),
            creationDate: undefined!,
            technologist: element.technologist!,
            dateOfReworkTechnologist: undefined!,
            representative: element.representative!,
            dateOfReworkRepresentative: undefined!,
            state: element.state!
          }]
        });

        this.resetFilters()

        this.listOfDisplayData = [...this.listOfData];
      },
      error: err => {
        console.log(err);
        
      }
    })
  }

  loadTechnologists(){
    this.http.getAllTechnologist().subscribe({
      next: data =>  { this.technologistList = data },
      error: err => {console.log(err);
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
      true
      /*
      item.nr.toString().indexOf(this.searchValue.toLocaleLowerCase()) !== -1 ||
      item.createDate.valueOf().toString().indexOf(this.searchValue.valueOf().toString()) !== -1 ||
      item.status.toLocaleLowerCase().indexOf(this.searchValue.toLocaleLowerCase()) !== -1 ||
      item.toha.toLocaleLowerCase().indexOf(this.searchValue.toLocaleLowerCase()) !== -1 ||
      item.vertreter.toLocaleLowerCase().indexOf(this.searchValue.toLocaleLowerCase()) !== -1 ||
      item.fachberater.toLocaleLowerCase().indexOf(this.searchValue.toLocaleLowerCase()) !== -1 ||
      item.timespan.valueOf().toString().indexOf(this.searchValue.valueOf().toString()) !== -1 ||
      item.abschlussbericht.toString().indexOf(this.searchValue.toString()) !== -1*/
    ));
  }
}

interface DataItem {
  company: string,
  dateOfVisit: string,
  creationDate: string,
  technologist: string,
  dateOfReworkTechnologist: string,
  representative: string,
  dateOfReworkRepresentative: string,
  state: string
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
  listOfFilter: {text: string, value: string}[];
  filterFn?: (list: string[], item: DataItem) => boolean;
}
