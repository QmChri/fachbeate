import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { Representative } from '../../../../models/representative';
import { NotificationService } from '../../../../services/notification.service';

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

  constructor(private http: HttpService, private notificationService: NotificationService) {}

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
    if (!this.inputRepresentative.firstName || this.inputRepresentative.firstName === "" || !this.inputRepresentative.lastName || this.inputRepresentative.lastName === "") {
      this.notificationService.createBasicNotification(4, 'Bitte Pflichtfelder ausfüllen!', 'Vorname* & Nachname*', 'topRight')
    }
    else {
      this.notificationService.createBasicNotification(0, 'Neuer Vertreter angelegt!', this.inputRepresentative.firstName + ' ' +
        this.inputRepresentative.lastName, 'topRight')
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
