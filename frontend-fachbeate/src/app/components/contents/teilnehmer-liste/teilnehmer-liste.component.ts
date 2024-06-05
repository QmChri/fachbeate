import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-teilnehmer-liste',
  templateUrl: './teilnehmer-liste.component.html',
  styleUrl: './teilnehmer-liste.component.scss'
})
export class TeilnehmerListeComponent implements OnInit {
  i = 0;
  editId: number | null = null;
  listOfData: ItemData[] = [];

  startEdit(id: number): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
  }

  addRow(): void {
    this.listOfData = [
      ...this.listOfData,
      {
        id: this.i,
        sex: `${this.i}`,
        firstName: `Max ${this.i}`,
        lastName: `Müller ${this.i}`,
        function: 'Geschäftsführer',
      }
    ];
    this.i++;
  }

  deleteRow(id: number): void {
    this.listOfData = this.listOfData.filter(d => d.id !== id);
  }

  ngOnInit(): void {
    this.addRow();
    this.addRow();
  }
}


interface ItemData {
  id: number;
  sex: string;
  firstName: string;
  lastName: string;
  function: string;
}
