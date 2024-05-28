import { Component } from '@angular/core';

@Component({
  selector: 'app-seminar-registration',
  templateUrl: './seminar-registration.component.html',
  styleUrl: './seminar-registration.component.scss'
})
export class SeminarRegistrationComponent {
  panelOpenState = false;
  panelOpenState2 = false;
  panelOpenState3 = false;
  panelOpenState4 = false;
  panelOpenState5 = false;
  buttonSelect: string[] = []
  geDip: string[] = []

}
