import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { Technologist } from '../../models/technologist';
import { NotificationService } from '../../services/notification.service';
import { RoleService } from '../../services/role.service';
import { TranslateService } from '@ngx-translate/core';
import { Company } from '../../models/company';
import * as XLSX from 'xlsx';
import { log } from '../../services/logger.service';
import { NzTableFilterList } from 'ng-zorro-antd/table';

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
  currentDate: Date = new Date();
  day = String(this.currentDate.getDate()).padStart(2, '0');
  month = String(this.currentDate.getMonth() + 1).padStart(2, '0'); // Monate sind 0-indexiert
  year = String(this.currentDate.getFullYear()).slice(-2); // Die letzten zwei Ziffern des Jahres
  formattedDate = `${this.day}_${this.month}_${this.year}`;
  fileName = 'TableData.xlsx';
  loading = false;
  public pageSize: number = 20;
  currentPage = 1;

  // All columns are defined here
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
      filterFn: (filter: string, item: DataItem) => {
        return (item.statusAL!.includes(filter) || item.statusGL!.includes(filter))
      }
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
      sortFn: (a: DataItem, b: DataItem) => {
        const aStart = a.timespan?.start?.valueOf()?.toString() ?? '';
        const bStart = b.timespan?.start?.valueOf()?.toString() ?? '';
        return aStart.localeCompare(bStart);
      },
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
      name: 'berichte',
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
    {
      name: 'canceled',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => 0,
      listOfFilter: [],
      filterFn: (list: boolean[], item: DataItem) => list.some(name => item.visible!.valueOf().toString().indexOf(name.valueOf().toString()) !== -1)
    }
  ];

  constructor(public translate: TranslateService, private router: Router, private http: HttpService, private notificationService: NotificationService, public roleService: RoleService) { }

  ngOnInit(): void {
    this.loadDataPerUser()
    this.getNzFilters()
    this.calculatePageSize();
    this.onPageIndexChange(this.currentPage);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calculatePageSize();
  }
  calculatePageSize(): void {
    const tableHeight = window.innerHeight - 80; //Puffer für Header/Footer
    const rowHeight = 60; // Höhe einer Tabellenzeile
    this.pageSize = Math.floor(tableHeight / rowHeight);
  }
  onPageIndexChange(pageIndex: number): void {
    this.currentPage = pageIndex; // Aktulle Seite der MainList
  }

  // All filters are defined here
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
        const filterValue2 = element.statusAL || "<Leer>";
        if (!uniqueFilters.some(filter => filter.value === filterValue)) {
          uniqueFilters.push({ text: filterValue, value: filterValue });
        } else if (!uniqueFilters.some(filter => filter.value === filterValue2)) {
          uniqueFilters.push({ text: filterValue2, value: filterValue2 });
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

    this.listOfColumn.find(element => element.name === 'berichte')!.listOfFilter =
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
        case '0':
          typeText = 'Besuch';
          break;
        case '1':
          typeText = 'Fachberater A.';
          break;
        case '2':
          typeText = 'Seminar';
          break;

        case '3':
          typeText = 'Reise A.';
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

    this.listOfColumn.find(element => element.name === 'canceled')!.listOfFilter = [
      { text: this.translate.instant('MAIN_LIST.visible'), value: "true", byDefault: true },
      { text: this.translate.instant('MAIN_LIST.!visible'), value: "false" }
    ];

    //this.filterMainList(5)
  }

  filterMainList(days: number) {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days - 1);
    this.listOfDisplayData = this.listOfDisplayData.filter(item => {
      if (!item.dateOfCreation) {
        return false;
      }
      const creationDate = new Date(item.dateOfCreation);
      return creationDate >= daysAgo;
    });
  }
  
  //All data for a user is received here
  loadDataPerUser() {
    this.loading = true;
    this.listOfDisplayData = []

    this.http.getAllCompany().subscribe({
      next: data => {
        var companies = data;
        this.loadData(companies);
        this.loading = false;
      }
    })
  }

  loadData(companies: Company[]) {
    var type = (this.roleService.checkPermission([1, 2, 3, 5, 7]) ? 7 : 6);
    type = (!this.roleService.checkPermission([1, 2, 4, 5, 6, 7]) ? 3 : type);
    type = (!this.roleService.checkPermission([1, 2, 3, 5, 6, 7]) ? 4 : type);
    type = ((!this.roleService.checkPermission([1, 2, 5, 6, 7]) && type !== 3 && type !== 4) ? 8 : type);
    var fullname: string[] = [this.roleService.getUserName()!, this.roleService.getEmail()!];

    if (type === 6 && fullname === undefined) {
      type = -1;
    }
    this.loadTechnologists();
    this.http.getCustomerRequirementsByUser(type!, fullname!).subscribe({
      next: data => {
        data.forEach(element => {

          this.listOfDisplayData = [...this.listOfDisplayData, {
            id: element.id,
            name: element.name,
            dateOfCreation: element.dateOfCreation,
            customerOrCompany: element.customerOrCompany,
            statusGL: element.statusGL,
            statusAL: element.statusAL,
            vertreter: element.representative,
            fachberater: element.technologist,
            timespan: {
              start: element.fromDate,
              end: element.toDate
            },
            customer: element.customer,
            abschlussbericht: element.finalReport,
            type: element.type,
            visible: element.visible
          }];
        });
        this.getNzFilters();
      },
      error: err => {
        log("main-list: ", err)
      }
    });

    this.http.getAllBookings(type!, fullname!).subscribe({
      next: data => {
        data.forEach(element => {

          this.listOfDisplayData = [...this.listOfDisplayData, {
            id: element.id,
            name: element.name,
            dateOfCreation: element.dateOfCreation,
            customerOrCompany: element.customerOrCompany,
            statusGL: element.statusGL,
            statusAL: element.statusAL,
            vertreter: element.representative,
            fachberater: element.technologist,
            timespan: {
              start: element.fromDate,
              end: element.toDate
            },
            customer: element.customer,
            abschlussbericht: element.finalReport,
            type: element.type,
            visible: element.visible
          }];
        });
        this.getNzFilters();
      },
      error: err => {
        log("main-list: ", err)
      }
    });

    this.http.getWorkshopByUser(type, fullname!).subscribe({
      next: data => {
        data.forEach(element => {

          this.listOfDisplayData = [...this.listOfDisplayData, {
            id: element.id!,
            name: element.name,
            dateOfCreation: element.dateOfCreation,
            customerOrCompany: element.customerOrCompany,
            statusGL: element.statusGL,
            statusAL: element.statusAL,
            vertreter: element.representative,
            fachberater: element.technologist,
            timespan: {
              start: element.fromDate,
              end: element.toDate
            },
            customer: element.customer!,
            abschlussbericht: element.finalReport,
            type: element.type,
            visible: element.visible
          }];
        });
        this.getNzFilters();
      },
      error: err => {
        log("main-list: ", err)
      }
    });

    this.http.getVisitorRegistrationByUser(type, fullname!).subscribe({
      next: data => {
        data.forEach(element => {
          this.listOfDisplayData = [...this.listOfDisplayData, {
            id: element.id!,
            name: element.name,
            dateOfCreation: element.dateOfCreation,
            customerOrCompany: element.customerOrCompany,
            statusGL: element.statusGL,
            statusAL: element.statusAL,
            vertreter: element.representative,
            fachberater: element.technologist,
            timespan: {
              start: element.fromDate,
              end: element.toDate
            },
            customer: element.customer!,
            abschlussbericht: element.finalReport,
            type: element.type,
            visible: element.visible
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
        log("main-list: ", err)
      }
    })
  }

  //Differentiation of the ids
  openCRC(data: any, id: string, type: number) {
    if (data.visible) {
      if (type === 0) {
        this.router.navigate(['/visitor-registration', id.split("_")[1]]);
      } else if (type === 1) {
        this.router.navigate(['/customer-requirements', id.split("_")[1]]);
      } else if (type === 2) {
        this.router.navigate(['/seminar-registration', id.split("_")[1]]);
      } else if (type === 3) {
        this.router.navigate(['/booking-request', id.split("_")[1]]);
      }
    }
  }

  resetSortAndFilters(): void {
    this.searchValue = "";
    this.translate.get('STANDARD.filter_sorting_removed').subscribe((translatedMessage: string) => {
      this.notificationService.createBasicNotification(2, translatedMessage, '', 'topRight');
    });
    this.getNzFilters();
    this.loadDataPerUser()
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
      //item.name!.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
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

    this.http.changeVisiblility(data.type, data.id.split("_")[1]).subscribe();

    if (!data.visible) {
      data.visible = true
    }
    else {
      data.visible = false
    }
  }

  exportToExcel(): void {
    const typeDescriptions: { [key: number]: string } = {
      1: 'Fachberater A.',
      2: 'Seminar',
      3: 'Besuch'
    };

    const exportData = this.listOfDisplayData.map(item => ({
      id: item.id || '<Leer>',
      name: item.name || '<Leer>',
      dateOfCreation: this.formatDate(item.dateOfCreation),
      customerOrCompany: item.customerOrCompany || '<Leer>',
      statusGL: item.statusGL || '<Leer>',
      statusAL: item.statusAL || '<Leer>',
      vertreter: item.vertreter || '<Leer>',
      fachberater: item.fachberater || '<Leer>',
      timestamp: this.formatTimespan(item.timespan),
      customer: item.customer || '<Leer>',
      abschlussbericht: item.abschlussbericht || '<Leer>',
      Type: typeDescriptions[item.type!] || '<Leer>',
      visible: item.visible ? 'Yes' : 'No'
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // Hinzufügen von Autofilter
    const range = XLSX.utils.decode_range(ws['!ref'] || '');
    ws['!autofilter'] = {
      ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: range.e.r, c: range.e.c } })
    };

    const colWidth: number[] = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxWidth = 10; // Mindestbreite
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const address = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = ws[address];
        if (cell && cell.v) {
          const cellLength = cell.v.toString().length;
          maxWidth = Math.max(maxWidth, cellLength);
        }
      }
      colWidth[C] = maxWidth + 6; // Extra Platz für Padding
    }
    ws['!cols'] = colWidth.map(width => ({ wpx: width * 5 }));

    // Formatierung der Header-Zeile
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[address]) continue;
      ws[address].s = {
        font: {
          bold: true,
          color: { rgb: 'FFFFFF' },
          sz: 20, // Schriftgröße
        }
      };
    }
    // neue Arbeitsmappe
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }

  formatDate(date?: string): string {
    if (!date) return '<Leer>';
    return new Date(date).toLocaleDateString();
  }
  formatTimespan(timespan?: TimeSpan): string {
    if (!timespan || !timespan.start || !timespan.end) return '<Leer>';
    return `${this.formatDate(timespan.start)} - ${this.formatDate(timespan.end)}`;
  }

  getPdf() {
    this.downloadFile();
    this.translate.get('STANDARD.pdf1').subscribe((translatedMessage: string) => {
      this.notificationService.createBasicNotification(0, translatedMessage, "Übersicht_Anforderungen_" + this.formattedDate + ".pdf", 'topRight');
    });
  }

  downloadFile() {
    this.http.getMainListPdf().subscribe(
      (response: Blob) => {
        this.saveFile(response, "Übersicht_Anforderungen_" + this.formattedDate + ".pdf")
      });
  }
  private saveFile(data: Blob, filename: string): void {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}

interface DataItem {
  id?: string;
  name?: string;
  dateOfCreation?: string;
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
  start?: string;
  end?: string;
}

interface ColumnDefinition {
  name: string;
  sortOrder: any;
  sortFn: (a: DataItem, b: DataItem) => number;
  listOfFilter: NzTableFilterList;
  filterFn?: (list: any, item: DataItem) => boolean;
}

