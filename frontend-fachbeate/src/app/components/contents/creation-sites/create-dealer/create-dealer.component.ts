import { Component, HostListener, OnInit } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { Company } from '../../../../models/company';
import { NotificationService } from '../../../../services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { log } from '../../../../services/logger.service';

@Component({
  selector: 'app-create-dealer',
  templateUrl: './create-dealer.component.html',
  styleUrl: './create-dealer.component.scss'
})
export class CreateDealerComponent implements OnInit {
  searchValue = '';
  visible = false;
  inputCompany: Company = { active: true };
  companyList: Company[] = [];
  public pageSize: number = 9;

  constructor(public translate: TranslateService, private http: HttpService, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.loadCompany();
    this.calculatePageSize();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calculatePageSize();
  }
  calculatePageSize(): void {
    const tableHeight = window.innerHeight - 254; //Puffer für Header/Footer
    const rowHeight = 54; // Höhe einer Tabellenzeile
    this.pageSize = Math.floor(tableHeight / rowHeight);
  }

  loadCompany() {
    this.http.getAllCompany().subscribe({
      next: data => {
        this.companyList = data
      },
      error: err => {
        log("create-representative: ", err)
      }
    })

  }

  postDealer() {
    if (!this.inputCompany.name || this.inputCompany.name === "") {
      this.translate.get(['STANDARD.please_fill_required_fields', 'STANDARD.dealer_name']).subscribe(translations => {
        const message = translations['STANDARD.please_fill_required_fields'];
        const anotherMessage = translations['STANDARD.dealer_name'];
        this.notificationService.createBasicNotification(4, message, anotherMessage, 'topRight');
      });
    }
    else {
      
      this.http.postCompany(this.inputCompany).subscribe({
        next: data => {
          
          this.translate.get('STANDARD.new_dealer_created').subscribe((translatedMessage: string) => {
            this.notificationService.createBasicNotification(0, translatedMessage, this.inputCompany.name!, 'topRight');
          });

          this.inputCompany = {
            id: 0,
            name: "",
            username: "",
            active: true
          }

          this.loadCompany();
        },
        error: err => {
          log("create-representative: ", err)
        }
      });
    }

  }

  cancelEdit() {
    this.inputCompany = {
      id: 0,
      name: "",
      username: "",
      active: true
    }
  }

  editRow(id: number) {
    const company: Company = this.companyList.find(element => element.id === id)!;
    this.inputCompany.name = company.name;
    this.inputCompany.active = company.active;
    this.inputCompany.username = company.username;
    this.inputCompany.id = company.id;
  }

  resetSearch(): void {
    this.searchValue = "";
    this.translate.get('STANDARD.filter_sorting_removed').subscribe((translatedMessage: string) => {
      this.notificationService.createBasicNotification(2, translatedMessage, '', 'topRight');
    });
    this.loadCompany();
  }
  search(): void {
    this.visible = false;
    this.companyList = this.companyList.filter((item: Company) =>
    (
      item.name!.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.id!.valueOf().toString().includes(this.searchValue.toLocaleLowerCase())
    ));
  }
}
