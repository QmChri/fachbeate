import { Component, OnInit } from '@angular/core';
import { Technologist } from '../../../../models/technologist';
import { HttpService } from '../../../../services/http.service';
import { Representative } from '../../../../models/representative';
@Component({
  selector: 'app-create-representative',
  templateUrl: './create-representative.component.html',
  styleUrl: './create-representative.component.scss'
})
export class CreateRepresentativeComponent implements OnInit {
  inputRepresentative: Representative = {
    id: 0,
    firstName: "",
    lastName: "",
    active: true,
  }

  representativeList: Representative[] = [];

  constructor(private http: HttpService) {
  }

  ngOnInit(): void {
    this.loadRepresentatives();
  }

  loadRepresentatives() {

    this.http.getAllRepresentative().subscribe({
      next: data => {
        this.representativeList = data
      },
      error: err => {
        console.log(err);
      }
    })
  }

  postRepresentative() {
    this.http.postRepresentative(
      {
        id: this.inputRepresentative.id!,
        firstName: this.inputRepresentative.firstName!,
        lastName: this.inputRepresentative.lastName,
        active: this.inputRepresentative.active
      }).subscribe({
        next: data => {
          this.inputRepresentative = {
            id: 0,
            firstName: "",
            lastName: "",
            active: true
          }

          this.loadRepresentatives();
        },
        error: err => {
          console.log(err);

        }
      });
  }

  cancelEdit() {
    this.inputRepresentative = {
      id: 0,
      firstName: "",
      lastName: "",
      active: true,
    }
  }

  editRow(id: number, type: number) {
      const representative: Representative = this.representativeList.find(element => element.id === id)!;
      this.inputRepresentative.firstName = representative.firstName;
      this.inputRepresentative.id = representative.id;
      this.inputRepresentative.lastName = representative.lastName;
      this.inputRepresentative.active = representative.active;
  }
}
