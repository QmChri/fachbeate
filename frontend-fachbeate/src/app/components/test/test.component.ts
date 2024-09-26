import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {

  allGroups: string[] = ["geschaeftsleitung", "abteilungsleitung", "front-office", "fachberater", "vertreter", "creator", "other"]
  groups: string[] = [];
  subject: string = "This is the Subject"
  message: string = "This is an Testmail"
  adress: string = ""

  constructor(private http: HttpService){}

  sendMail(){
    this.http.sendMail(this.groups, undefined!, this.message, this.subject).subscribe();
  }

  sendToAdress(){
    this.http.sendToAdress(this.adress, this.message, this.subject).subscribe();
  }

}
