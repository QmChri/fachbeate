import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { Representative } from '../../../../models/representative';
import { NotificationService } from '../../../../services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { log } from '../../../../app.module';

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
    email: "",
    active: true,
  }
  representativeList: Representative[] = [];

  constructor(public translate: TranslateService, private http: HttpService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.loadRepresentatives();
  }

  loadRepresentatives() {

    this.http.getAllRepresentative().subscribe({
      next: data => {
        this.representativeList = data
      },
      error: err => {
        log("create-representative: ", err)
      }
    })
  }

  postRepresentative() {
    if (!this.inputRepresentative.firstName || this.inputRepresentative.firstName === "" || !this.inputRepresentative.lastName || this.inputRepresentative.lastName === "") {
      this.translate.get(['STANDARD.please_fill_required_fields', 'STANDARD.first_and_last_name']).subscribe(translations => {
        const message = translations['STANDARD.please_fill_required_fields'];
        const anotherMessage = translations['STANDARD.first_and_last_name'];
        this.notificationService.createBasicNotification(4, message, anotherMessage, 'topRight');
      });
    }
    else {
      this.translate.get('STANDARD.new_representative_created').subscribe((translatedMessage: string) => {
        this.notificationService.createBasicNotification(0, translatedMessage, this.inputRepresentative.firstName + ' ' +
          this.inputRepresentative.lastName, 'topRight');
      });

      this.http.postRepresentative(
        {
          id: this.inputRepresentative.id!,
          firstName: this.inputRepresentative.firstName!,
          lastName: this.inputRepresentative.lastName,
          email: this.inputRepresentative.email,
          active: this.inputRepresentative.active
        }).subscribe({
          next: data => {
            this.inputRepresentative = {
              id: 0,
              firstName: "",
              lastName: "",
              email: "",
              active: true
            }

            this.loadRepresentatives();
          },
          error: err => {
            log("create-representative: ", err)
          }
        });
    }
  }

  cancelEdit() {
    this.inputRepresentative = {
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      active: true,
    }
  }

  editRow(id: number, type: number) {
    const representative: Representative = this.representativeList.find(element => element.id === id)!;
    this.inputRepresentative.id = representative.id;
    this.inputRepresentative.firstName = representative.firstName;
    this.inputRepresentative.lastName = representative.lastName;
    this.inputRepresentative.email = representative.email;
    this.inputRepresentative.active = representative.active;
  }
}
