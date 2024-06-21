import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { Technologist } from '../../models/technologist';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../services/notification.service';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-main-list',
  templateUrl: './main-list.component.html',
  styleUrls: ['./main-list.component.scss']
})
export class MainListComponent implements OnInit {
  searchValue = '';
  visible = false;

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
      name: 'timespan',
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
      name: 'typ',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.type!.valueOf().toString().localeCompare(b.type!.valueOf().toString()),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.type!.valueOf().toString().indexOf(name.valueOf().toString()) !== -1)
    }
  ];

  constructor(private router: Router, private http: HttpService, private translate: TranslateService,
    private _snackBar: MatSnackBar, private notificationService: NotificationService, private roleService: RoleService) {
  }

  ngOnInit(): void {
    //this.tmpinitData();
    this.loadData();
    this.getNzFilters();
  }

  getNzFilters() {
    const uniqueFilter = new Set<string>();

    this.listOfColumn.find(element => element.name === 'name')!.listOfFilter =
      this.listOfDisplayData.reduce((uniqueFilters, element) => {
        if (!uniqueFilters.some(filter => filter.value === element.name!)) {
          uniqueFilters.push({ text: element.name!, value: element.name! });
        }
        return uniqueFilters;
      }, [] as { text: string, value: string }[]);
    this.listOfColumn.find(element => element.name === 'customerOrCompany')!.listOfFilter =
      this.listOfDisplayData.reduce((uniqueFilters, element) => {
        if (!uniqueFilters.some(filter => filter.value === element.customerOrCompany!)) {
          uniqueFilters.push({ text: element.customerOrCompany!, value: element.customerOrCompany! });
        }
        return uniqueFilters;
      }, [] as { text: string, value: string }[]); this.listOfColumn.find(element => element.name === 'state')!.listOfFilter =
        this.listOfDisplayData.reduce((uniqueFilters, element) => {
          if (!uniqueFilters.some(filter => filter.value === element.status!)) {
            uniqueFilters.push({ text: element.status!, value: element.status! });
          }
          return uniqueFilters;
        }, [] as { text: string, value: string }[]);
    this.listOfColumn.find(element => element.name === 'representative')!.listOfFilter =
      this.listOfDisplayData.reduce((uniqueFilters, element) => {
        if (!uniqueFilters.some(filter => filter.value === element.vertreter!)) {
          uniqueFilters.push({ text: element.vertreter!, value: element.vertreter! });
        }
        return uniqueFilters;
      }, [] as { text: string, value: string }[]); this.listOfColumn.find(element => element.name === 'technologist')!.listOfFilter =
        this.listOfDisplayData.reduce((uniqueFilters, element) => {
          if (!uniqueFilters.some(filter => filter.value === element.fachberater!)) {
            uniqueFilters.push({ text: element.fachberater!, value: element.fachberater! });
          }
          return uniqueFilters;
        }, [] as { text: string, value: string }[]);
    this.listOfColumn.find(element => element.name === 'customer')!.listOfFilter =
      this.listOfDisplayData.reduce((uniqueFilters, element) => {
        if (!uniqueFilters.some(filter => filter.value === element.customer!)) {
          uniqueFilters.push({ text: element.customer!, value: element.customer! });
        }
        return uniqueFilters;
      }, [] as { text: string, value: string }[]);
    this.listOfColumn.find(element => element.name === 'final-report')!.listOfFilter =
      this.listOfDisplayData.reduce((uniqueFilters, element) => {
        if (!uniqueFilters.some(filter => filter.value === element.abschlussbericht!)) {
          uniqueFilters.push({ text: element.abschlussbericht!, value: element.abschlussbericht! });
        }
        return uniqueFilters;
      }, [] as { text: string, value: string }[]);
    this.listOfColumn.find(element => element.name === 'typ')!.listOfFilter = this.listOfDisplayData.map(element => {
      let typeText;
      switch (element.type!.toString()) {
        case '0':
          typeText = 'Fachberater A.';
          break;
        case '1':
          typeText = 'Seminar';
          break;
        case '2':
          typeText = 'Besuch';
          break;
        default:
          typeText = element.type!.toString();
      }
      return {
        text: typeText, value: element.type!.toString()
      };
    })
      .filter(element => {
        if (!uniqueFilter.has(element.text)) {
          uniqueFilter.add(element.text);
          return true;
        }
        return false;
      });
  }

  loadData() {

    var type = (this.roleService.checkPermission([1,2,3,5,7])?7:6);
    type = (!this.roleService.checkPermission([1,2,3,5,6,7])?4:type);

    var fullname = (type === 6?this.roleService.getUserName()!:this.roleService.getFullName()!);


    this.loadTechnologists();
    this.http.getCustomerRequirementsByUser(type!, fullname!).subscribe({
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


          this.listOfDisplayData = [...this.listOfDisplayData, {
            id: element.id!,
            name: element.company?.name!,
            dateOfCreation: element.dateOfCreation !== undefined ? element.dateOfCreation : new Date(),
            customerOrCompany: "",
            status: "false",
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
      },
      error: err => {
        console.log(err);
        
      }
    });

    this.http.getWorkshopByUser(type, fullname).subscribe({
      next: data => {
        data.forEach(element => {

          var tmpStatus = "in-progress";
          if ((element.releaseManagement != null && element.releaseManagement != undefined)
            || (element.releaseSupervisor != null && element.releaseSupervisor != undefined)) {
            tmpStatus = "open";
          }

          this.listOfDisplayData = [...this.listOfDisplayData, {
            id: element.id!,
            name: "",
            dateOfCreation: element.dateOfCreation !== undefined ? element.dateOfCreation : new Date(),
            customerOrCompany: "",
            status: "false",
            vertreter: element.representative!.firstName + " " + element.representative!.lastName,
            fachberater: element.requestedTechnologist!.map(a => a.firstName + " " + a.lastName).toString(),
            timespan: {
              start: element.startDate,
              end: element.endDate
            },
            customer: element.customer!,
            abschlussbericht: 'false',
            type: 1
          }];

        });
      },
      error: err => {

      }
    });

    this.http.getVisitorRegistrationByUser(type, fullname).subscribe({

      next: data => {
        data.forEach(element => {

          this.listOfDisplayData = [...this.listOfDisplayData, {
            id: element.id!,
            name: element.name!,
            dateOfCreation: element.dateOfCreation !== undefined ? element.dateOfCreation : new Date(),
            customerOrCompany: element.customerOrCompany!,
            status: element.releaserManagement,
            vertreter: element.representative!.firstName + " " + element.representative!.lastName,
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
    if (type === 0) {
      this.router.navigate(['/customer-requirements', id]);
    } else if (type === 1) {
      this.router.navigate(['/seminar-registration', id]);
    } else if (type === 2) {
      this.router.navigate(['/visitorRegistration', id]);
    }
  }

  resetSortAndFilters(): void {
    this.searchValue = '';
    this.notificationService.createBasicNotification(2, 'Filter/Sortierung aufgehoben!', '', 'topRight');
    this.getNzFilters();
    //this.tmpinitData();
    this.listOfColumn.forEach(item => {
      item.sortOrder = null;
    });
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfDisplayData.filter((item: DataItem) =>
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

  tmpinitData() {
    this.listOfDisplayData = [
      {
        id: 1,
        name: "Project A - Long Name Test",
        dateOfCreation: new Date("2023-06-01"),
        customerOrCompany: "Example GmbH - Long Name Test",
        status: "true",
        vertreter: "B",
        fachberater: "C",
        timespan: {
          start: new Date("2023-06-01"),
          end: new Date("2023-06-30"),
        },
        customer: "A",
        abschlussbericht: "Fertig",
        type: 1,
      },
      {
        id: 2,
        name: "Project B - Testing Long Names",
        dateOfCreation: new Date("2023-06-02"),
        customerOrCompany: "Demo AG - Example Long Company Name",
        status: "false",
        vertreter: "C",
        fachberater: "A",
        timespan: {
          start: new Date("2023-07-10"),
          end: new Date("2023-07-31"),
        },
        customer: "F",
        abschlussbericht: "In Arbeit",
        type: 2,
      },
      {
        id: 3,
        name: "Project C - Another Long Test Name",
        dateOfCreation: new Date("2023-06-03"),
        customerOrCompany: "Test GmbH - Long Customer Name for Testing",
        status: "true",
        vertreter: "Hans Schmidt",
        fachberater: "Sabine Fischer",
        timespan: {
          start: new Date("2023-08-05"),
          end: new Date("2023-08-20"),
        },
        customer: "TEster langer Test",
        abschlussbericht: "Fertig",
        type: 0,
      },
      // Additional test data
      {
        id: 4,
        name: "Project D - Extended Name for Testing",
        dateOfCreation: new Date("2023-06-04"),
        customerOrCompany: "Alpha Ltd. - Long Customer Company Name",
        status: "true",
        vertreter: "D",
        fachberater: "E",
        timespan: {
          start: new Date("2023-09-01"),
          end: new Date("2023-09-15"),
        },
        customer: "C",
        abschlussbericht: "Fertig",
        type: 1,
      },
      {
        id: 5,
        name: "Project E - Long Name Test for Data",
        dateOfCreation: new Date("2023-06-05"),
        customerOrCompany: "Beta Corp. - Test Company Name for Long Data",
        status: "false",
        vertreter: "E",
        fachberater: "F",
        timespan: {
          start: new Date("2023-10-01"),
          end: new Date("2023-10-10"),
        },
        customer: "D",
        abschlussbericht: "Nicht gestartet",
        type: 0,
      },
      {
        id: 6,
        name: "Project F - More Test Data with Long Names",
        dateOfCreation: new Date("2023-06-06"),
        customerOrCompany: "Gamma Inc. - Long Company Name for Testing",
        status: "true",
        vertreter: "F",
        fachberater: "G",
        timespan: {
          start: new Date("2023-11-01"),
          end: new Date("2023-11-20"),
        },
        customer: "E",
        abschlussbericht: "In Arbeit",
        type: 2,
      },
      {
        id: 7,
        name: "Project G - Final Test with Long Names",
        dateOfCreation: new Date("2023-06-07"),
        customerOrCompany: "Delta LLC - Long Name for Delta Company",
        status: "false",
        vertreter: "G",
        fachberater: "H",
        timespan: {
          start: new Date("2023-12-01"),
          end: new Date("2023-12-15"),
        },
        customer: "F",
        abschlussbericht: "Fertig",
        type: 1,
      },
      {
        id: 8,
        name: "Project H - Large Scale Testing Names",
        dateOfCreation: new Date("2023-06-08"),
        customerOrCompany: "Epsilon GmbH - Large Customer Name for Testing",
        status: "true",
        vertreter: "H",
        fachberater: "I",
        timespan: {
          start: new Date("2023-12-20"),
          end: new Date("2023-12-31"),
        },
        customer: "G",
        abschlussbericht: "Fertig",
        type: 0,
      },
      {
        id: 9,
        name: "Project I - Extensive Data with Long Names",
        dateOfCreation: new Date("2023-06-09"),
        customerOrCompany: "Zeta AG - Comprehensive Testing Name for Customer",
        status: "false",
        vertreter: "I",
        fachberater: "J",
        timespan: {
          start: new Date("2024-01-01"),
          end: new Date("2024-01-15"),
        },
        customer: "H",
        abschlussbericht: "In Arbeit",
        type: 2,
      },
      {
        id: 10,
        name: "Project J - Advanced Testing for Large Names",
        dateOfCreation: new Date("2023-06-10"),
        customerOrCompany: "Theta Corp. - Testing Company for Large Names",
        status: "true",
        vertreter: "J",
        fachberater: "K",
        timespan: {
          start: new Date("2024-02-01"),
          end: new Date("2024-02-10"),
        },
        customer: "I",
        abschlussbericht: "Nicht gestartet",
        type: 1,
      },
    ];
  }
}

interface DataItem {
  id?: number;
  name?: string;
  dateOfCreation?: Date;
  customerOrCompany?: string;
  status?: string;
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

