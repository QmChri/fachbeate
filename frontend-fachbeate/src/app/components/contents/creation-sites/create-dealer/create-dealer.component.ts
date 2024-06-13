import { Component, OnInit } from '@angular/core';
import { Technologist } from '../../../../models/technologist';
import { HttpService } from '../../../../services/http.service';
import { Representative } from '../../../../models/representative';
import { Company } from '../../../../models/company';
@Component({
  selector: 'app-create-dealer',
  templateUrl: './create-dealer.component.html',
  styleUrl: './create-dealer.component.scss'
})
export class CreateDealerComponent implements OnInit {
  inputCompany: Company = {};

  companyList: Company[] = [];

  constructor(private http: HttpService) {
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
