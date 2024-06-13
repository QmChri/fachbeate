import { Component, OnInit } from '@angular/core';
import { Technologist } from '../../../../models/technologist';
import { HttpService } from '../../../../services/http.service';
import { Representative } from '../../../../models/representative';

@Component({
  selector: 'app-create-technologist',
  templateUrl: './create-technologist.component.html',
  styleUrl: './create-technologist.component.scss'
})
export class CreateTechnologistComponent implements OnInit {
  inputTechnologist: Technologist = {
    id: 0,
    firstName: "",
    lastName: "",
    active: true,
    color: "#ff0000"
  }

  technologistList: Technologist[] = [];

  constructor(private http: HttpService) {
  }

  ngOnInit(): void {
    this.loadTechnologists();
  }

  loadTechnologists() {
    this.http.getAllTechnologist().subscribe({
      next: data => {
        this.technologistList = data
      },
      error: err => {
        console.log(err);
      }
    })
  }

  postTechnologist() {
    this.http.postTechnologist(this.inputTechnologist).subscribe({
      next: data => {
        this.inputTechnologist = {
          id: 0,
          firstName: "",
          lastName: "",
          active: true,
          color: "#000000"
        }

        this.loadTechnologists();
      },
      error: err => {
        console.log(err);

      }
    });
  }

  cancelEdit() {
    this.inputTechnologist = {
      id: 0,
      firstName: "",
      lastName: "",
      active: true,
      color: ""
    }
  }

  editRow(id: number, type: number) {
      const technologist: Technologist = this.technologistList.find(element => element.id === id)!;
      this.inputTechnologist.firstName = technologist.firstName;
      this.inputTechnologist.id = technologist.id;
      this.inputTechnologist.lastName = technologist.lastName;
      this.inputTechnologist.active = technologist.active;
      this.inputTechnologist.color = technologist.color;
  }
}
