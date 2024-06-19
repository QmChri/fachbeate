import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { Technologist } from '../../models/technologist';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-main-list',
  templateUrl: './main-list.component.html',
  styleUrls: ['./main-list.component.scss']
})
export class MainListComponent implements OnInit {
  searchValue = '';
  visible = false;
  listOfData: DataItem[] = [];

  technologistList: Technologist[] = [];

  listOfDisplayData: DataItem[] = [];
  listOfColumn: ColumnDefinition[] = [
    {
      name: 'name',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.name!.toString().localeCompare(b.name!.toString()),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(a => item.name!.indexOf(a) !== -1)
    },
    {
      name: 'dateOfCreation',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.dateOfCreation!.valueOf() - b.dateOfCreation!.valueOf(),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'customerOrCompany',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.customerOrCompany!.toString().localeCompare(b.customerOrCompany!.toString()),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.customerOrCompany!.indexOf(name) !== -1)
    },
    {
      name: 'state',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => 1,
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'representative',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.vertreter!.localeCompare(b.vertreter!),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.vertreter!.indexOf(name) !== -1)
    },
    {
      name: 'technologist',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.fachberater!.localeCompare(b.fachberater!),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.fachberater!.indexOf(name) !== -1)
    },
    {
      name: 'time-frame',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.timespan!.valueOf().toString().localeCompare(b.timespan!.valueOf().toString()),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'customer',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.customer!.localeCompare(b.customer!),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.customer!.indexOf(name) !== -1)
    },
    {
      name: 'final-report',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.abschlussbericht!.valueOf().toString().localeCompare(b.abschlussbericht!.valueOf().toString()),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.abschlussbericht!.valueOf().toString().indexOf(name.valueOf().toString()) !== -1)
    },
    {
      name: 'Typ',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.abschlussbericht!.valueOf().toString().localeCompare(b.abschlussbericht!.valueOf().toString()),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.abschlussbericht!.valueOf().toString().indexOf(name.valueOf().toString()) !== -1)
    }
  ];

  constructor(private router: Router, private http: HttpService, private translate: TranslateService,
    private _snackBar: MatSnackBar, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.tmpinitData();
    this.getNzFilters();
    //this.loadData();
  }

  getNzFilters() {
    
    
  }

  //TODO nur temporär
  tmpinitData() {
    this.listOfDisplayData = [
      {
        id: 1,
        name: "Projekt A",
        dateOfCreation: new Date("2023-06-01"),
        customerOrCompany: "Example GmbH",
        status: true,
        vertreter: "Max Mustermann",
        fachberater: "Anna Schmidt",
        timespan: {
          start: new Date("2023-06-01"),
          end: new Date("2023-06-30")
        },
        customer: "Kunde XY",
        abschlussbericht: "Fertiggestellt",
        type: 2
      },
      {
        id: 2,
        name: "Projekt B",
        dateOfCreation: new Date("2023-07-10"),
        customerOrCompany: "Demo AG",
        status: false,
        vertreter: "Julia Müller",
        fachberater: "Markus Weber",
        timespan: {
          start: new Date("2023-07-10"),
          end: new Date("2023-07-31")
        },
        customer: "Kunde Z",
        abschlussbericht: "In Arbeit",
        type: 1
      },
      {
        id: 3,
        name: "Projekt C",
        dateOfCreation: new Date("2023-08-05"),
        customerOrCompany: "Test GmbH",
        status: true,
        vertreter: "Hans Schmidt",
        fachberater: "Sabine Fischer",
        timespan: {
          start: new Date("2023-08-05"),
          end: new Date("2023-08-20")
        },
        customer: "Kunde ABC",
        abschlussbericht: "Fertiggestellt",
        type: 3
      }
    ];
  }


  //TODO Freigeben button mit funktion noch verknüpfen
  release(nr: number) {
    this._snackBar.open("Freigegeben? ", "JA");
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

          var cntFinalReports: number = 0;

          element.customerVisits.forEach(element => {
            if (element.finalReport !== undefined && element.finalReport !== null) {
              cntFinalReports = cntFinalReports + 1;
            }
          });

          var color = cntFinalReports.toString().localeCompare(element.customerVisits.length.toString());
          if (cntFinalReports === 0) { color = 1 }


          this.listOfData = [...this.listOfData, {
            id: element.id!,
            name: element.company?.name!,
            dateOfCreation: element.dateOfCreation !== undefined ? element.dateOfCreation : new Date(),
            customerOrCompany: "",
            status: false,
            vertreter: element.representative?.firstName! + element.representative?.lastName!,
            fachberater: element.requestedTechnologist?.firstName! + element.requestedTechnologist?.lastName!,
            timespan: {
              start: element.startDate,
              end: element.endDate
            },
            customer: "",
            abschlussbericht: cntFinalReports + "/" + element.customerVisits.length,
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

          this.listOfData = [...this.listOfData, {
            id: element.id!,
            name: "",
            dateOfCreation: element.dateOfCreation !== undefined ? element.dateOfCreation : new Date(),
            customerOrCompany: "",
            status: false,
            vertreter: element.seminarPresenter!,
            fachberater: element.requestedTechnologist!.map(a => a.firstName + " " + a.lastName).toString(),
            timespan: {
              start: element.startDate,
              end: element.endDate
            },
            customer: element.company!,
            abschlussbericht: 'false',
            type: 1
          }];

        });

        this.resetFilters()

        this.listOfDisplayData = [...this.listOfData];
      },
      error: err => {

      }
    });

    this.http.getVisitorRegistration().subscribe({

      next: data => {

        var visitorDataList: DataItem[] = []

        console.log(data);


        data.forEach(element => {

          visitorDataList = [...visitorDataList, {
            id: element.id!,
            name: element.name!,
            dateOfCreation: element.dateOfCreation !== undefined ? element.dateOfCreation : new Date(),
            customerOrCompany: element.customerOrCompany!,
            status: element.releaseManagement! || element.releaseSupervisor!,
            vertreter: element.responsibleSupervisor!,
            fachberater: "",
            timespan: {
              start: element.fromDate,
              end: element.toDate
            },
            customer: "",
            abschlussbericht: "",
            type: 2
          }];

        });

        this.listOfDisplayData = [...visitorDataList];
      }
    })

  }

  loadTechnologists() {
    this.http.getAllTechnologist().subscribe({
      next: data => { this.technologistList = data },
      error: err => {
        console.log(err);
      }
    })
  }

  openCRC(id: number, type: number) {
    console.log(id + " " + type);

    if (type === 0) {
      this.router.navigate(['/customer-requirements', id]);
    } else if (type === 1) {
      this.router.navigate(['/seminar-registration', id]);
    } else if (type === 2) {
      this.router.navigate(['/visitorRegistration', id]);
    }
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

        this.technologistList.forEach(technolgist => {
          tmp = [...tmp, { text: technolgist.firstName + " " + technolgist.lastName, value: technolgist.firstName + " " + technolgist.lastName }]
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
    this.searchValue = '';
    this.notificationService.createBasicNotification(2, 'Filter/Sortierung aufgehoben!', '', 'topRight');
    this.getNzFilters();
    this.tmpinitData();
    this.listOfColumn.forEach(item => {
      item.sortOrder = null;
    });
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfData.filter((item: DataItem) =>
    (
      item.name!.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.dateOfCreation!.toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.customerOrCompany!.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.status!.valueOf().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.vertreter!.valueOf().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.fachberater!.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.timespan!.toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.customer!.valueOf().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.abschlussbericht!.valueOf().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.type!.valueOf().toString().includes(this.searchValue.toLocaleLowerCase())
    ));
  }
}

interface DataItem {
  id?: number;
  name?: string;
  dateOfCreation?: Date;
  customerOrCompany?: string;
  status?: boolean;
  vertreter?: string;
  fachberater?: string;
  timespan?: TimeSpan;
  customer: string;
  abschlussbericht?: string;
  type?: number;
}

interface TimeSpan {
  start?: Date;
  end?: Date;
}

interface ColumnDefinition {
  name: string;
  sortOrder: any;
  sortFn: (a: DataItem, b: DataItem) => number;
  listOfFilter: { text: string, value: string }[];
  filterFn?: (list: string[], item: DataItem) => boolean;
}
