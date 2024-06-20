import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { Technologist } from '../../../models/technologist';
import { Article } from '../../../models/article';
import { NotificationService } from '../../../services/notification.service';

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

  listOfColumn: ColumnDefinition[] = [
    {
      name: 'company',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.company!.localeCompare(b.company!),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.company.indexOf(name) !== -1)
    },
    {
      name: 'datecustomerVisit',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.dateOfVisit!.valueOf() - b.dateOfVisit!.valueOf(),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'responsibleFB',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.technologist.localeCompare(b.technologist),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.technologist.indexOf(name) !== -1)
    },
    {
      name: 'toDoTechno',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.toBeCompletedBy!.valueOf() - b.toBeCompletedBy!.valueOf(),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'responsibleRepresentative',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.representative!.localeCompare(b.representative!),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.representative.indexOf(name) !== -1)
    },
    {
      name: 'Kunde kontaktiert am',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.customerContactDate!.valueOf() - b.customerContactDate!.valueOf(),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => true
    },
    {    //TODO fehlt noch Bericht abgeschlossen -> Hackerl wenn abgeschlossen
      name: 'Bericht abgeschlossen',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.abschlussberichtFinished!.localeCompare(b.abschlussberichtFinished!),
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.abschlussberichtFinished!.indexOf(name) !== -1)
    },
    {
      name: 'Artikel',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => 1,
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) => true
    }
  ];

  constructor(private router: Router, private http: HttpService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.tmpinitData();
    this.getNzFilters();
    //this.loadData();
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

  //TODO nur temporär
  tmpinitData() {
    this.listOfDisplayData = [
      {
        company: 'Alpha Corporation',
        dateOfVisit: new Date('2023-06-18'),
        technologist: 'A',
        toBeCompletedBy: new Date('2023-06-20'),
        representative: 'A',
        customerContactDate: new Date('2023-06-10'),
        abschlussberichtFinished: 'yes',
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
        abschlussberichtFinished: 'yes',
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
        abschlussberichtFinished: 'no',
        article: [
          { name: 'Article 4', articleNr: 'G001' },
          { name: 'Article 5', articleNr: 'G002' }
        ]
      }
    ];
  }

  loadData() {

    this.loadTechnologists();

    this.http.getAllArticles().subscribe({
      next: data => {

        this.listOfColumn.find(element => element.name === 'article')!.listOfFilter = data.map(element => { return { text: element.name!, value: element.name! } })

      }
    })

    this.http.getFinalReports().subscribe({
      next: data => {
        data.forEach(element => {

          var allArticles: Article[] = []

          element.reasonReports!.forEach(reason => {
            allArticles = [...allArticles, ...reason.presentedArticle]
          })

          this.listOfData = [...this.listOfData, {
            company: element.company!,
            dateOfVisit: element.dateOfVisit!,
            technologist: element.technologist!,
            toBeCompletedBy: element.reworkByRepresentativeDoneUntil!,
            representative: element.representative!,
            customerContactDate: element.customerContactDate!,
            abschlussberichtFinished: (element.requestCompleted) ? "Ja" : "Nein",
            article: allArticles
          }]
        });
        this.getNzFilters()

        this.listOfDisplayData = [...this.listOfData];
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

  openCRC(dateNr: number, type: number) {
    if (type === 0) {
      this.router.navigate(['/customer-requirements', dateNr]);
    } else if (type === 1) {
      this.router.navigate(['/seminar-registration', dateNr]);
    }
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

}

interface DataItem {
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
