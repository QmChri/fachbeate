import { Component, OnInit } from '@angular/core';
import {MatExpansionPanel} from '@angular/material/expansion';



@Component({
  selector: 'app-seminar-registration',
  templateUrl: './seminar-registration.component.html',
  styleUrl: './seminar-registration.component.scss'
})
export class SeminarRegistrationComponent implements OnInit {

  panelState: boolean = false;

  ngOnInit(): void {
  }

  changePanelState(panel: MatExpansionPanel) {

  }
}
