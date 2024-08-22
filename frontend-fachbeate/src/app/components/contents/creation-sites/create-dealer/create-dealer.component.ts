import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { Company } from '../../../../models/company';
import { NotificationService } from '../../../../services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { log } from '../../../../app.module';

@Component({
  selector: 'app-create-dealer',
  templateUrl: './create-dealer.component.html',
  styleUrl: './create-dealer.component.scss'
})
export class CreateDealerComponent implements OnInit {
  inputCompany: Company = { active: true };
  companyList: Company[] = [];

  constructor(public translate: TranslateService, private http: HttpService, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.loadCompany();
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
      this.translate.get('STANDARD.new_dealer_created').subscribe((translatedMessage: string) => {
        this.notificationService.createBasicNotification(0, translatedMessage, this.inputCompany.name!, 'topRight');
      });
      this.http.postCompany(this.inputCompany).subscribe({
        next: data => {
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

}
