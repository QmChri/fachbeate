import { Component, OnInit } from '@angular/core';
import { Technologist } from '../../../../models/technologist';
import { HttpService } from '../../../../services/http.service';
import { Representative } from '../../../../models/representative';
import { Company } from '../../../../models/company';
import { NotificationService } from '../../../../services/notification.service';
@Component({
  selector: 'app-create-dealer',
  templateUrl: './create-dealer.component.html',
  styleUrl: './create-dealer.component.scss'
})
export class CreateDealerComponent implements OnInit {
  inputCompany: Company = { active: true };

  companyList: Company[] = [];

  constructor(private http: HttpService, private notificationService: NotificationService) {
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
        console.log(err);
      }
    })

  }

  postDealer() {
    if (!this.inputCompany.name || this.inputCompany.name === "") {
      this.notificationService.createBasicNotification(4, 'Bitte Pflichtfelder ausfüllen!', 'Händlerbezeichnung*', 'topRight')
    }
    else {
      this.notificationService.createBasicNotification(0, 'Neuer Händler angelegt!', this.inputCompany.name, 'topRight')
      this.http.postCompany(this.inputCompany).subscribe({
        next: data => {
          this.inputCompany = {
            id: 0,
            name: "",
            active: true
          }

          this.loadCompany();
        },
        error: err => {
          console.log(err);
        }
      });
    }

  }

  cancelEdit() {
    this.inputCompany = {
      id: 0,
      name: "",
      active: true
    }
  }

  editRow(id: number) {
    const company: Company = this.companyList.find(element => element.id === id)!;
    this.inputCompany.name = company.name;
    this.inputCompany.active = company.active;
    this.inputCompany.id = company.id;
  }

}
