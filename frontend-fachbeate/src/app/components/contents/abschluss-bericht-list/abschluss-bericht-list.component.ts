import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { Technologist } from '../../../models/technologist';
import { Article } from '../../../models/article';
import { NotificationService } from '../../../services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { RoleService } from '../../../services/role.service';
import { FinalReport } from '../../../models/final-report';
import { MatDialog } from '@angular/material/dialog';
import { AbschlussBerichtComponent } from '../abschluss-bericht/abschluss-bericht.component';
import { Company } from '../../../models/company';
import { LoggerService, log } from '../../../services/logger.service';

@Component({
  selector: 'abschluss-bericht-list',
  templateUrl: './abschluss-bericht-list.component.html',
  styleUrl: './abschluss-bericht-list.component.scss'
})
export class AbschlussBerichtListComponent {
  searchValue = '';
  visible = false;
  currentDate: Date = new Date();
  day = String(this.currentDate.getDate()).padStart(2, '0');
  month = String(this.currentDate.getMonth() + 1).padStart(2, '0'); // Monate sind 0-indexiert
  year = String(this.currentDate.getFullYear()).slice(-2); // Die letzten zwei Ziffern des Jahres
  formattedDate = `${this.day}_${this.month}_${this.year}`;
  showArticles: number[] = [];
  finalReports: FinalReport[] = []
  technologistList: Technologist[] = [];
  listOfDisplayData: DataItem[] = [];
  listOfColumn: ColumnDefinition[] = [
    {
      name: 'customer',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.company!.localeCompare(b.company!),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.company.indexOf(name) !== -1)
    },
    {
      name: 'visit_date',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => {
        if (a.dateOfVisit === null || a.dateOfVisit === undefined) return 1;
        if (b.dateOfVisit === null || b.dateOfVisit === undefined) return -1;
        return Date.parse(a.dateOfVisit.toString()) - Date.parse(b.dateOfVisit.toString());
      },
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'responsible_representative',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.representative.localeCompare(b.representative),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.representative.indexOf(name) !== -1)
    },
    {
      name: 'to_be_done_by_FB',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => {
        if (a.reworkByTechnologistDoneUntil === null) return 1;
        if (b.reworkByTechnologistDoneUntil === null) return -1;
        return a.reworkByTechnologistDoneUntil.getTime() - b.reworkByTechnologistDoneUntil.getTime();
      },
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'responsible_advisor',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.technologist!.localeCompare(b.technologist!),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.technologist.indexOf(name) !== -1)
    },
    {
      name: 'customer_contacted_on',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => {
        if (a.customerContactDate === null || a.customerContactDate === undefined) return 1;
        if (b.customerContactDate === null || b.customerContactDate === undefined) return -1;
        return Date.parse(a.customerContactDate.toString()) - Date.parse(b.customerContactDate.toString());
      },
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'report_completed',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.abschlussberichtFinished!.localeCompare(b.abschlussberichtFinished!),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.abschlussberichtFinished!.indexOf(name) !== -1)
    },
    {
      name: 'article_number',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => {
        // Annahme: Wir vergleichen die Artikelnummern der ersten Elemente in a.article und b.article
        if (a.article[0] === null || a.article[0] === undefined) {
          return -1;
        }

        if (b.article[0] === null || b.article[0] === undefined) {
          return 1;
        }

        return a.article[0].articleNr! - b.article[0].articleNr!;
      },
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'id',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => 1,
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => true
    }
  ];

  constructor(public translate: TranslateService,
    private http: HttpService, private notificationService: NotificationService,
    private roleService: RoleService, private dialog: MatDialog, private LOG: LoggerService) {
  }

  ngOnInit(): void {
    //this.tmpinitData();
    this.loadDataPerUser();
    this.getNzFilters();
  }

  getNzFilters() {
    this.listOfColumn.find(element => element.name === 'customer')!.listOfFilter =
      this.listOfDisplayData.reduce((uniqueFilters, element) => {
        const filterValue = element.company || "<Leer>";
        if (!uniqueFilters.some(filter => filter.value === filterValue)) {
          uniqueFilters.push({ text: filterValue, value: filterValue });
        }
        return uniqueFilters;
      }, [] as { text: string, value: string }[]);


    this.listOfColumn.find(element => element.name === 'responsible_advisor')!.listOfFilter =
      this.listOfDisplayData.reduce((uniqueFilters, element) => {
        const filterValue = element.technologist || "<Leer>";
        if (!uniqueFilters.some(filter => filter.value === filterValue)) {
          uniqueFilters.push({ text: filterValue, value: filterValue });
        }
        return uniqueFilters;
      }, [] as { text: string, value: string }[]);

    this.listOfColumn.find(element => element.name === 'responsible_representative')!.listOfFilter =
      this.listOfDisplayData.reduce((uniqueFilters, element) => {
        const filterValue = element.representative || "<Leer>";
        if (!uniqueFilters.some(filter => filter.value === filterValue)) {
          uniqueFilters.push({ text: filterValue, value: filterValue });
        }
        return uniqueFilters;
      }, [] as { text: string, value: string }[]);


    this.listOfColumn.find(element => element.name === 'report_completed')!.listOfFilter =
      this.listOfDisplayData.reduce((uniqueFilters, element) => {
        if (!uniqueFilters.some(filter => filter.value === element.abschlussberichtFinished)) {
          uniqueFilters.push({ text: element.abschlussberichtFinished, value: element.abschlussberichtFinished });
        }
        return uniqueFilters;
      }, [] as { text: string, value: string }[]);
  }

  loadDataPerUser() {
    this.http.getAllCompany().subscribe({
      next: data => {
        var companies = data;
        this.loadData(companies)
      }
    })
  }

  loadData(companies: Company[]) {
    this.loadTechnologists();
    this.http.getAllArticles().subscribe({
      next: data => {
        this.listOfColumn.find(element => element.name === 'article_number')!.listOfFilter = data.map(element => { return { text: element.name!, value: element.name! } })
      }
    })

    //region set the type of user
    var type = (this.roleService.checkPermission([1, 2, 3, 5, 7]) ? 7 : 6);
    type = (!this.roleService.checkPermission([1, 2, 4, 5, 6, 7]) ? 3 : type);
    type = (!this.roleService.checkPermission([1, 2, 3, 5, 6, 7]) ? 4 : type);
    type = (!this.roleService.checkPermission([1, 2, 5, 6, 7]) ? 8 : type);
    //endregion

    //region Get the requirements for an specific user
    var fullname: string[] = [this.roleService.getUserName()!, this.roleService.getEmail()!];

    this.http.getFinalReportsByUser(type, fullname!).subscribe({
      next: data => {
        this.finalReports = data;

        data.forEach(element => {
          var allArticles: Article[] = []

          element.reasonReports!.forEach(reason => {
            allArticles = [...allArticles, ...reason.presentedArticle]
          })

          this.listOfDisplayData = [...this.listOfDisplayData, {
            id: element.id!,
            company: (element.company!) ? element.company : "<Leer>",
            dateOfVisit: (element.dateOfVisit!) ? element.dateOfVisit : null!,
            technologist: element.technologist!.firstName + " " + element.technologist!.lastName,
            reworkByTechnologistDoneUntil: element.reworkByTechnologistDoneUntil!,
            representative: element.representative!.firstName + " " + element.representative!.lastName,
            customerContactDate: element.customerContactDate!,
            abschlussberichtFinished: (element.requestCompleted) ? "Ja" : "Nein",
            article: allArticles
          }]
        });
        this.getNzFilters()
      },
      error: err => {
        log("abschluss-bericht-list: ", err)
      }
    })
    //endregion
  }

  loadTechnologists() {
    this.http.getAllTechnologist().subscribe({
      next: data => { this.technologistList = data },
      error: err => {
        log("abschluss-bericht-list: ", err)
      }
    })
  }

  openDialog(dataItem: DataItem) {
    //region Opening the Final Report Popup
    const dialogRef = this.dialog.open(AbschlussBerichtComponent, {
      width: '90%',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: this.finalReports.find(element => element.id === dataItem.id)
    });

    // endregion

    dialogRef.afterClosed().subscribe(
      (data: {finalReport: FinalReport, save: boolean, files: File[]}) => {
        //region When the popup is closed, this data is transferred

        if (data.save) {

          let finalReport: FinalReport = data.finalReport;

          let formData = new FormData();

          if(data.files !== null && data.files !== undefined){
            data.files!.forEach(element => {
              formData.append("files", element!)
            })
          }

          formData.append('finalReport', JSON.stringify(finalReport));

          this.http.postFinalReportMultiPart(formData).subscribe({
            next: (response) => {
              console.log(response);
            },
            error: (error) => {
              console.log(error);
            }
          });

        /*
          this.http.postFinalReport(data.finalReport).subscribe({
            next: finalRep => {



              var newEntity: DataItem = {
                id: finalRep.id!,
                company: (finalRep.company!) ? finalRep.company : "<Leer>",
                dateOfVisit: (finalRep.dateOfVisit!) ? finalRep.dateOfVisit : undefined!,
                technologist: finalRep.technologist!.firstName + " " + finalRep.technologist!.lastName,
                reworkByTechnologistDoneUntil: finalRep.reworkByTechnologistDoneUntil!,
                representative: finalRep.representative!.firstName + " " + finalRep.representative!.lastName,
                customerContactDate: finalRep.customerContactDate!,
                abschlussberichtFinished: (finalRep.requestCompleted) ? "Ja" : "Nein",
                article: []
              }

              finalRep.reasonReports!.forEach(element => {
                newEntity.article = [...newEntity.article, ...element.presentedArticle]
              });

              this.listOfDisplayData = this.listOfDisplayData.map(entity => entity.id === finalRep.id ? newEntity : entity)
            }
          });

          */
        }
        // endregion
      });

  }

  resetSortAndFilters(): void {
    this.searchValue = '';
    this.translate.get('STANDARD.filter_sorting_removed').subscribe((translatedMessage: string) => {
      this.notificationService.createBasicNotification(2, translatedMessage, '', 'topRight');
    });
    this.getNzFilters();
    this.listOfColumn.forEach(item => {
      item.sortOrder = null;
    });
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfDisplayData.filter((item: DataItem) =>
    (
      item.company.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.dateOfVisit.toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.technologist.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.reworkByTechnologistDoneUntil.toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.representative.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.customerContactDate.toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.abschlussberichtFinished.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase())
      //item.article.forEach(article => article.name?.valueOf().toLocaleLowerCase().includes(this.searchValue.toLocaleLowerCase()))
    ));
  }

  getArticleListName(article: Article[], id: number) {
    if (article.length === 0) {
      return "<Leer>"
    }
    if (this.showArticles.includes(id)) {
      return article.map(element => element.articleNr);
    }
    var returnValue: string = article.map(element => element.articleNr).toString().substring(0, 14);
    return returnValue + ((returnValue.length == 14) ? "..." : "")
  }

  disableShow(id: number) {
    this.showArticles = this.showArticles.filter(element => element !== id);
  }

  getPdf() {
    this.downloadFile();
    this.translate.get('STANDARD.pdf1').subscribe((translatedMessage: string) => {
      this.notificationService.createBasicNotification(0, translatedMessage, "Übersicht_Abschlussberichte_"+this.formattedDate+".pdf", 'topRight');
    });
  }

  downloadFile() {
    this.http.getFinalReportListPdf().subscribe(
      (response: Blob) => {
        this.saveFile(response, "Übersicht_Abschlussberichte_"+this.formattedDate+".pdf")
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
  id: number,
  company: string,
  dateOfVisit: Date,
  technologist: string,
  reworkByTechnologistDoneUntil: Date,
  representative: string,
  customerContactDate: Date,
  abschlussberichtFinished: string,
  article: Article[],
}

interface ColumnDefinition {
  name: string;
  sortOrder: any;
  sortFn: (a: DataItem, b: DataItem) => number;
  listOfFilter: { text: string, value: string }[];
  filterFn?: (list: string[], item: DataItem) => boolean;
}
