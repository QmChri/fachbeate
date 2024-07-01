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

@Component({
  selector: 'app-abschluss-bericht-list',
  templateUrl: './abschluss-bericht-list.component.html',
  styleUrl: './abschluss-bericht-list.component.scss'
})
export class AbschlussBerichtListComponent {
  searchValue = '';
  visible = false;
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
      sortFn: (a: DataItem, b: DataItem) => a.dateOfVisit!.valueOf() - b.dateOfVisit!.valueOf(),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'responsible_advisor',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.technologist.localeCompare(b.technologist),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.technologist.indexOf(name) !== -1)
    },
    {
      name: 'to_be_done_by',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.toBeCompletedBy!.valueOf() - b.toBeCompletedBy!.valueOf(),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'responsible_representative',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.representative!.localeCompare(b.representative!),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.representative.indexOf(name) !== -1)
    },
    {
      name: 'customer_contacted_on',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.customerContactDate!.valueOf() - b.customerContactDate!.valueOf(),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => true
    },
    {    //TODO fehlt noch Bericht abgeschlossen -> Hackerl wenn abgeschlossen
      name: 'report_completed',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.abschlussberichtFinished!.localeCompare(b.abschlussberichtFinished!),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.abschlussberichtFinished!.indexOf(name) !== -1)
    },
    {
      name: 'article',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => 1,
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => true
    }
  ];

  finalReports: FinalReport[] = []

  constructor(private router: Router, private translate: TranslateService, 
    private http: HttpService, private notificationService: NotificationService,
     private roleService: RoleService, private dialog: MatDialog) { }

  ngOnInit(): void {
    //this.tmpinitData();
    this.loadData();
    this.getNzFilters();
  }

  getNzFilters() {
    this.listOfColumn.find(element => element.name === 'company')!.listOfFilter = this.listOfDisplayData.map(element => { return { text: element.company, value: element.company } })
    this.listOfColumn.find(element => element.name === 'responsibleFB')!.listOfFilter = this.listOfDisplayData.map(element => { return { text: element.representative, value: element.representative } })
    this.listOfColumn.find(element => element.name === 'responsibleRepresentative')!.listOfFilter = this.listOfDisplayData.map(element => { return { text: element.representative, value: element.representative } })
    this.listOfColumn.find(element => element.name === 'Bericht abgeschlossen')!.listOfFilter =
      this.listOfDisplayData.reduce((uniqueFilters, element) => {
        if (!uniqueFilters.some(filter => filter.value === element.abschlussberichtFinished)) {
          uniqueFilters.push({ text: element.abschlussberichtFinished, value: element.abschlussberichtFinished });
        }
        return uniqueFilters;
      }, [] as { text: string, value: string }[]);
  }

  loadData() {

    this.loadTechnologists();

    this.http.getAllArticles().subscribe({
      next: data => {
        this.listOfColumn.find(element => element.name === 'article')!.listOfFilter = data.map(element => { return { text: element.name!, value: element.name! } })
      }
    })

    var type = (this.roleService.checkPermission([1, 2, 3, 5, 7]) ? 7 : 6);
    type = (!this.roleService.checkPermission([1, 2, 3, 5, 6, 7]) ? 4 : type);
    var fullname = (type === 6 ? this.roleService.getUserName()! : this.roleService.getFullName()!);    


    this.http.getFinalReportsByUser(type, fullname).subscribe({
      next: data => {
        console.log(data);
        
        this.finalReports = data;

        data.forEach(element => {
          var allArticles: Article[] = []

          element.reasonReports!.forEach(reason => {
            allArticles = [...allArticles, ...reason.presentedArticle]
          })

          this.listOfDisplayData = [...this.listOfDisplayData, {
            id: element.id!,
            company: element.company!,
            dateOfVisit: element.dateOfVisit!,
            technologist: element.technologist!,
            toBeCompletedBy: element.reworkByRepresentativeDoneUntil!,
            representative: element.representative!,
            customerContactDate: element.customerContactDate!,
            abschlussberichtFinished: (element.requestCompleted) ? "ja" : "nein",
            article: allArticles
          }]
        });
        this.getNzFilters()
      },
      error: err => {
        console.log(err);
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

  openDialog(dataItem: DataItem) {

    const dialogRef = this.dialog.open(AbschlussBerichtComponent, {
      height: '42.5rem',
      width: '80rem',
      data: this.finalReports.find(element => element.id === dataItem.id)
    });
    
  }

  resetSortAndFilters(): void {
    this.searchValue = '';
    this.translate.get('STANDARD.filter_sorting_removed').subscribe((translatedMessage: string) => {
      this.notificationService.createBasicNotification(2, translatedMessage, '', 'topRight');
    });
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
      item.company.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.dateOfVisit.toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.technologist.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.toBeCompletedBy.toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.representative.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.customerContactDate.toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.abschlussberichtFinished.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.article.valueOf().toString().includes(this.searchValue.toLocaleLowerCase()))
    );
  }

  getArticleListName(article: Article[]) {
    return article.map(element => element.name).toString().substring(0, 30)
  }

  /*
  tmpinitData() {
    this.listOfDisplayData = [
      {
        company: 'Alpha Corporation',
        dateOfVisit: new Date('2023-06-18'),
        technologist: 'A',
        toBeCompletedBy: new Date('2023-06-20'),
        representative: 'A',
        customerContactDate: new Date('2023-06-10'),
        abschlussberichtFinished: 'Ja',
        article: [
          { name: 'Article 1', articleNr: 'A001' },
          { name: 'Article 2', articleNr: 'A002' }
        ]
      },
      {
        company: 'Beta Industries',
        dateOfVisit: new Date('2023-06-19'),
        technologist: 'B',
        toBeCompletedBy: new Date('2023-06-25'),
        representative: 'B',
        customerContactDate: new Date('2023-06-12'),
        abschlussberichtFinished: 'Nein',
        article: [
          { name: 'Article 3', articleNr: 'B001' }
        ]
      },
      {
        company: 'Camma Technologies',
        dateOfVisit: new Date('2023-06-20'),
        technologist: 'C',
        toBeCompletedBy: new Date('2023-06-28'),
        representative: 'C',
        customerContactDate: new Date('2023-06-14'),
        abschlussberichtFinished: 'Nein',
        article: [
          { name: 'Article 4', articleNr: 'G001' },
          { name: 'Article 5', articleNr: 'G002' }
        ]
      }
    ];
  }*/
}

interface DataItem {
  id: number,
  company: string,
  dateOfVisit: Date,
  technologist: string,
  toBeCompletedBy: Date,
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
