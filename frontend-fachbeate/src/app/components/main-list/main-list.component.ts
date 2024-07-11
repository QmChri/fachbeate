import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { Technologist } from '../../models/technologist';
import { NotificationService } from '../../services/notification.service';
import { RoleService } from '../../services/role.service';
import { TranslateService } from '@ngx-translate/core';
import { Company } from '../../models/company';

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
      name: 'id',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => 1,
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'creation_date',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.dateOfCreation!.toString().valueOf().localeCompare(b.dateOfCreation!.toString().valueOf()),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'requested_by',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.customerOrCompany!.toString().localeCompare(b.customerOrCompany!.toString()),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.customerOrCompany!.indexOf(name) !== -1)
    },
    {
      name: 'status',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.statusGL!.toString().localeCompare(b.statusGL!.toString()),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.statusGL!.indexOf(name) !== -1)
    },
    {
      name: 'representative',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.vertreter!.localeCompare(b.vertreter!),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.vertreter!.indexOf(name) !== -1)
    },
    {
      name: 'advisor',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.fachberater!.localeCompare(b.fachberater!),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.fachberater!.indexOf(name) !== -1)
    },
    {
      name: 'requested_period',
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
      name: 'final_report',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.abschlussbericht!.valueOf().toString().localeCompare(b.abschlussbericht!.valueOf().toString()),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.abschlussbericht!.valueOf().toString().indexOf(name.valueOf().toString()) !== -1)
    },
    {
      name: 'type',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.type! - b.type!,
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.type!.valueOf().toString().indexOf(name.valueOf().toString()) !== -1)
    },
  ];

  constructor(public translate: TranslateService, private router: Router, private http: HttpService, private notificationService: NotificationService, public roleService: RoleService) { }

  ngOnInit(): void {
    //this.tmpinitData();
    this.loadDataPerUser()
    this.getNzFilters();
  }

  getNzFilters() {
    const uniqueFilter = new Set<string>();

    this.listOfColumn.find(element => element.name === 'requested_by')!.listOfFilter =
      this.listOfDisplayData.reduce((uniqueFilters, element) => {
        const filterValue = element.customerOrCompany || "<Leer>";
        if (!uniqueFilters.some(filter => filter.value === filterValue)) {
          uniqueFilters.push({ text: filterValue, value: filterValue });
        }
        return uniqueFilters;
      }, [] as { text: string, value: string }[]);

    this.listOfColumn.find(element => element.name === 'status')!.listOfFilter =
      this.listOfDisplayData.reduce((uniqueFilters, element) => {
        const filterValue = element.statusGL || "<Leer>";
        if (!uniqueFilters.some(filter => filter.value === filterValue)) {
          uniqueFilters.push({ text: filterValue, value: filterValue });
        }
        return uniqueFilters;
      }, [] as { text: string, value: string }[]);

    this.listOfColumn.find(element => element.name === 'representative')!.listOfFilter =
      this.listOfDisplayData.reduce((uniqueFilters, element) => {
        const filterValue = element.vertreter || "<Leer>";
        if (!uniqueFilters.some(filter => filter.value === filterValue)) {
          uniqueFilters.push({ text: filterValue, value: filterValue });
        }
        return uniqueFilters;
      }, [] as { text: string, value: string }[]);

    this.listOfColumn.find(element => element.name === 'advisor')!.listOfFilter =
      this.listOfDisplayData.reduce((uniqueFilters, element) => {
        const filterValue = element.fachberater || "<Leer>";
        if (!uniqueFilters.some(filter => filter.value === filterValue)) {
          uniqueFilters.push({ text: filterValue, value: filterValue });
        }
        return uniqueFilters;
      }, [] as { text: string, value: string }[]);

    this.listOfColumn.find(element => element.name === 'customer')!.listOfFilter =
      this.listOfDisplayData.reduce((uniqueFilters, element) => {
        const filterValue = element.customer || "<Leer>";
        if (!uniqueFilters.some(filter => filter.value === filterValue)) {
          uniqueFilters.push({ text: filterValue, value: filterValue });
        }
        return uniqueFilters;
      }, [] as { text: string, value: string }[]);

    this.listOfColumn.find(element => element.name === 'final_report')!.listOfFilter =
      this.listOfDisplayData.reduce((uniqueFilters, element) => {
        const filterValue = element.abschlussbericht || "<Leer>";
        if (!uniqueFilters.some(filter => filter.value === filterValue)) {
          uniqueFilters.push({ text: filterValue, value: filterValue });
        }
        return uniqueFilters;
      }, [] as { text: string, value: string }[]);

    this.listOfColumn.find(element => element.name === 'type')!.listOfFilter = this.listOfDisplayData.map(element => {
      let typeText;
      switch (element.type!.toString()) {
        case '1':
          typeText = 'Fachberater A.';
          break;
        case '2':
          typeText = 'Seminar';
          break;
        case '0':
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

  loadDataPerUser() {
    this.listOfDisplayData = []

    this.http.getAllCompany().subscribe({
      next: data => {
        var companies = data;
        this.loadData(companies)
      }
    })
  }

  loadData(companies: Company[]) {
    var type = (this.roleService.checkPermission([1, 2, 3, 5, 7]) ? 7 : 6);
    type = (!this.roleService.checkPermission([1, 2, 4, 5, 6, 7]) ? 3 : type);
    type = (!this.roleService.checkPermission([1, 2, 3, 5, 6, 7]) ? 4 : type);
    var fullname = (type === 6) ? companies.find(element => element.username === this.roleService.getUserName()!)?.username : this.roleService.getEmail()!;

    if (type === 6 && fullname === undefined) {
      type = -1;
    }

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

          this.listOfDisplayData = [...this.listOfDisplayData, {
            id: "F_" + element.id!,
            name: element.company?.name!,
            dateOfCreation: element.dateOfCreation !== undefined ? element.dateOfCreation : new Date(),
            customerOrCompany: element.creator,
            statusGL: element.releaseSupervisor ? 'GL Freigegeben ' : 'GL Nicht-Freigegeben',
            statusAL: element.releaseManagement ? 'AL Freigegeben ' : 'AL Nicht-Freigegeben',
            vertreter: element.representative?.firstName! + " " + element.representative?.lastName!,
            fachberater: element.requestedTechnologist?.firstName! + " " + element.requestedTechnologist?.lastName!,
            timespan: {
              start: element.startDate,
              end: element.endDate
            },
            customer: (element.customerVisits[0]) ? element.customerVisits[0].companyName! : "<Leer>",
            abschlussbericht: cntFinalReports + "/" + element.customerVisits.length,
            type: 1,
            visible: element.showUser!
          }];
        });
        this.getNzFilters();
      },
      error: err => {
        console.log(err);
      }
    });

    this.http.getWorkshopByUser(type, fullname!).subscribe({
      next: data => {
        data.forEach(element => {

          var tmpStatus = "in-progress";
          if ((element.releaseManagement != null && element.releaseManagement != undefined)
            || (element.releaseSupervisor != null && element.releaseSupervisor != undefined)) {
            tmpStatus = "open";
          }

          this.listOfDisplayData = [...this.listOfDisplayData, {
            id: "S_" + element.id!,
            name: "<Leer>",
            dateOfCreation: element.dateOfCreation !== undefined ? element.dateOfCreation : new Date(),
            customerOrCompany: element.creator,
            statusGL: element.releaseSupervisor ? 'GL Freigegeben ' : 'GL Nicht-Freigegeben',
            statusAL: element.releaseManagement ? 'AL Freigegeben ' : 'AL Nicht-Freigegeben',
            vertreter: element.representative!.firstName + " " + element.representative!.lastName,
            fachberater: element.requestedTechnologist!.map(a => a.firstName + " " + a.lastName).toString(),
            timespan: {
              start: element.startDate,
              end: element.endDate
            },
            customer: element.customer!,
            abschlussbericht: '<leer>',
            type: 2,
            visible: element.showUser!
          }];

        });
        this.getNzFilters();
      },
      error: err => {
        console.log(err);
      }
    });

    this.http.getVisitorRegistrationByUser(type, fullname!).subscribe({
      next: data => {
        data.forEach(element => {
          this.listOfDisplayData = [...this.listOfDisplayData, {
            id: "B_" + element.id!,
            name: element.name!,
            dateOfCreation: element.dateOfCreation !== undefined ? element.dateOfCreation : new Date(),
            customerOrCompany: element.customerOrCompany!,
            statusGL: element.releaseSupervisor ? 'GL Freigegeben ' : 'GL Nicht-Freigegeben',
            statusAL: element.releaseManagement ? 'AL Freigegeben ' : 'AL Nicht-Freigegeben',
            vertreter: (element.representative !== null && element.representative !== undefined)?element.representative!.firstName + " " + element.representative!.lastName:"<Leer>",
            fachberater: "<Leer>",
            timespan: {
              start: element.fromDate,
              end: element.toDate
            },
            customer: (element.customerOrCompany) ? element.customerOrCompany : "<leer>",
            abschlussbericht: "<Leer>",
            type: 0,
            visible: element.showUser!
          }];
        });
        this.getNzFilters();
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

  openCRC(data: any, id: string, type: number) {
    if (data.visible) {
      if (type === 0) {
        this.router.navigate(['/visitorRegistration', id.split("_")[1]]);
      } else if (type === 1) {
        this.router.navigate(['/customer-requirements', id.split("_")[1]]);
      } else if (type === 2) {
        this.router.navigate(['/seminar-registration', id.split("_")[1]]);
      }
    }
  }

  resetSortAndFilters(): void {
    this.searchValue = "";
    this.translate.get('STANDARD.filter_sorting_removed').subscribe((translatedMessage: string) => {
      this.notificationService.createBasicNotification(2, translatedMessage, '', 'topRight');
    });
    this.getNzFilters();
    this.loadDataPerUser();
    //this.tmpinitData();
    this.listOfColumn.forEach(item => {
      item.sortOrder = null;
    });
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfDisplayData.filter((item: DataItem) =>
    (
      item.id!.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.name!.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.dateOfCreation!.toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.customerOrCompany!.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.statusAL!.valueOf().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.statusGL!.valueOf().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.vertreter!.valueOf().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.fachberater!.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.timespan!.toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.customer!.valueOf().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.abschlussbericht!.valueOf().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.type!.valueOf().toString().includes(this.searchValue.toLocaleLowerCase())
    ));
  }

  changeEditable(data: any) {

    this.http.changeVisiblility(data.type, data.id).subscribe();

    if (!data.visible) {
      data.visible = true
    }
    else {
      data.visible = false
    }
  }
}

interface DataItem {
  id?: string;
  name?: string;
  dateOfCreation?: Date;
  customerOrCompany?: string;
  statusGL?: string;
  statusAL?: string;
  vertreter?: string;
  fachberater?: string;
  timespan?: TimeSpan;
  customer: string;
  abschlussbericht?: string;
  type?: number;
  visible: boolean;
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

