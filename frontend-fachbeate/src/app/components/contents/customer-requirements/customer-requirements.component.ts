import { Component } from '@angular/core';
import { Technologist } from '../../../models/technologist';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-customer-requirements',
  standalone: true,
  imports: [MatSelectModule],
  templateUrl: './customer-requirements.component.html',
  styleUrl: './customer-requirements.component.scss'
})
export class CustomerRequirementsComponent {
  technologenList: Technologist[] = [
    { firstName: 'Max', lastName: 'Mustermann', active: true },
    { firstName: 'Maria', lastName: 'Musterfrau', active: false },
    { firstName: 'John', lastName: 'Doe', active: true }
  ]
}
