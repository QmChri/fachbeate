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
      name: 'customer',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.company.toString().localeCompare(b.company.toString()),
      listOfFilter: [
        { text: ' ', value: ' ' },
      ],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'datecustomerVisit',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.dateOfVisit.toString().localeCompare(b.dateOfVisit.toString()),
      listOfFilter: [
        { text: ' ', value: ' ' },
      ],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'responsibleFB',
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
      name: 'toDoTechno',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.toBeCompletedBy!.valueOf().toString().localeCompare(b.toBeCompletedBy!.valueOf().toString()),
      listOfFilter: [
        { text: ' ', value: ' ' }
      ],
      filterFn: (list: string[], item: DataItem) => true
    },
    {
      name: 'responsibleRepresentative',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.representative.localeCompare(b.representative),
      listOfFilter: [
        { text: '', value: '' }
      ],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.representative.indexOf(name) !== -1)
    },
    {
      name: 'Kunde kontaktiert am',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.customerContactDate!.valueOf().toString().localeCompare(b.customerContactDate!.valueOf().toString()),
      listOfFilter: [
        { text: ' ', value: ' ' }
      ],
      filterFn: (list: string[], item: DataItem) => true
    },
    {    //TODO fehlt noch Bericht abgeschlossen -> Hackerl wenn abgeschlossen
      name: 'Bericht abgeschlossen',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.abschlussberichtFinished!.localeCompare(b.abschlussberichtFinished!),
      listOfFilter: [
        { text: 'abgeschlossen', value: 'open' },
        { text: 'nicht abgeschlossen', value: 'in-progress' }
      ],
      filterFn: (list: string[], item: DataItem) => list.some(name => item.abschlussberichtFinished!.indexOf(name) !== -1)
    },
    {
      name: 'Artikel',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => 1,
      listOfFilter: [
      ],
      filterFn: (list: string[], item: DataItem) => true
    }
  ];


  constructor(private router: Router, private http: HttpService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.listOfDisplayData = [
      {
        company: 'Alpha Corporation',
        dateOfVisit: new Date('2023-06-15'),
        technologist: 'Max Mustermann',
        toBeCompletedBy: new Date('2023-06-20'),
        representative: 'Erika Musterfrau',
        customerContactDate: new Date('2023-06-10'),
        abschlussberichtFinished: 'Ja',
        article: [
          { name: 'Article 1', articleNr: 'A001' },
          { name: 'Article 2', articleNr: 'A002' }
        ]
      },
      {
        company: 'Beta Industries',
        dateOfVisit: new Date('2023-06-18'),
        technologist: 'Anna Schmidt',
        toBeCompletedBy: new Date('2023-06-25'),
        representative: 'Hans Müller',
        customerContactDate: new Date('2023-06-12'),
        abschlussberichtFinished: 'Nein',
        article: [
          { name: 'Article 3', articleNr: 'B001' }
        ]
      },
      {
        company: 'Gamma Technologies',
        dateOfVisit: new Date('2023-06-20'),
        technologist: 'John Doe',
        toBeCompletedBy: new Date('2023-06-28'),
        representative: 'Jane Smith',
        customerContactDate: new Date('2023-06-14'),
        abschlussberichtFinished: 'Ja',
        article: [
          { name: 'Article 4', articleNr: 'G001' },
          { name: 'Article 5', articleNr: 'G002' }
        ]
      }
    ];
    //this.loadData();
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
            abschlussberichtFinished: (element.requestCompleted) ? "Abgeschlossen" : "Nicht Abgeschlossen",
            article: allArticles
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
    this.notificationService.createBasicNotification(2, 'Filter/Sortierung aufgehoben!', '', 'topRight');
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
