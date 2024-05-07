import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-requirements',
  standalone: true,
  imports: [],
  templateUrl: './customer-requirements.component.html',
  styleUrl: './customer-requirements.component.scss'
})
export class CustomerRequirementsComponent {
  testdaten = [
    { id: 1, name: 'Test 1', value: 10 },
    { id: 2, name: 'Test 2', value: 20 },
    { id: 3, name: 'Test 3', value: 30 }
  ];
}
