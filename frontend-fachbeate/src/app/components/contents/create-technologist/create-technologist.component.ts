import { Component, OnInit } from '@angular/core';
import { Technologist } from '../../../models/technologist';
import { HttpService } from '../../../services/http.service';
import { Representative } from '../../../models/representative';

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

  typeSelect?: string = '0';

  technologistList: Technologist[] = [];
  representativeList: Representative[] = [];

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

    this.http.getAllRepresentative().subscribe({
      next: data => {
        this.representativeList = data
      },
      error: err => {
        console.log(err);
      }
    })
  }

  postTechnologist(type: string) {
    if(type === '0'){
      this.http.postTechnologist(this.inputTechnologist).subscribe({
        next: data => {
          this.inputTechnologist = {
            id: 0,
            firstName: "",
            lastName: "",
            active: true,
            color: ""
          }

          this.loadTechnologists();
        },
        error: err => {
          console.log(err);

        }
      });
    }else if(type === '1'){
      this.http.postRepresentative(
        {
          id: this.inputTechnologist.id!,
          firstName: this.inputTechnologist.firstName!,
          lastName: this.inputTechnologist.lastName,
           active: this.inputTechnologist.active
        }).subscribe({
        next: data => {
          this.inputTechnologist = {
            id: 0,
            firstName: "",
            lastName: "",
            active: true,
            color: ""
          }

          this.loadTechnologists();
        },
        error: err => {
          console.log(err);

        }
      });
    }
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
    if(type === 0){
      const technologist: Technologist = this.technologistList.find(element => element.id === id)!;
      this.inputTechnologist.firstName = technologist.firstName;
      this.inputTechnologist.id = technologist.id;
      this.inputTechnologist.lastName = technologist.lastName;
      this.inputTechnologist.active = technologist.active;
      this.inputTechnologist.color = technologist.color;
    }else if(type === 1){
      const representative: Representative = this.representativeList.find(element => element.id === id)!;
      this.inputTechnologist.firstName = representative.firstName;
      this.inputTechnologist.id = representative.id;
      this.inputTechnologist.lastName = representative.lastName;
      this.inputTechnologist.active = representative.active;
    }
  }

  test(){console.log(this.typeSelect === '1')}
}
