import { Component, OnInit } from '@angular/core';
import { Technologist } from '../../../../models/technologist';
import { HttpService } from '../../../../services/http.service';
import { NotificationService } from '../../../../services/notification.service';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(private translate: TranslateService, private http: HttpService, private notificationService: NotificationService) { }

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
    if (!this.inputTechnologist.firstName || this.inputTechnologist.firstName === "" || !this.inputTechnologist.lastName || this.inputTechnologist.lastName === "") {
      this.translate.get(['STANDARD.please_fill_required_fields', 'STANDARD.first_and_last_name']).subscribe(translations => {
        const message = translations['STANDARD.please_fill_required_fields'];
        const anotherMessage = translations['STANDARD.first_and_last_name'];
        this.notificationService.createBasicNotification(4, message, anotherMessage, 'topRight');
      });
    }
    else {
      this.translate.get('STANDARD.new_advisor_created').subscribe((translatedMessage: string) => {
        this.notificationService.createBasicNotification(0, translatedMessage, this.inputTechnologist.firstName + ' ' +
          this.inputTechnologist.lastName, 'topRight');
      });
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
