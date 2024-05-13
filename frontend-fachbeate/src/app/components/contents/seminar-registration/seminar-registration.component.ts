import { Component, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';



@Component({
  selector: 'app-seminar-registration',
  templateUrl: './seminar-registration.component.html',
  standalone: true,
  imports: [MatSelectModule,MatExpansionModule],
  styleUrl: './seminar-registration.component.scss'
})
export class SeminarRegistrationComponent implements OnInit {
  panelOpenState = true;
  ngOnInit(): void {
  }

}
