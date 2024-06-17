import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-teilnehmer-liste',
  templateUrl: './teilnehmer-liste.component.html',
  styleUrl: './teilnehmer-liste.component.scss'
})
export class TeilnehmerListeComponent implements OnInit {
  i = 1;
  editId: number | null = null;
  listOfData: ItemData[] = [];

  constructor(
    public dialogRef: MatDialogRef<TeilnehmerListeComponent>,
    @Inject(MAT_DIALOG_DATA) public cnt: number
  ) {
    for (let i = 1; i <= this.cnt; i++) {
      this.addRow();

    }
  }

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
  }
}

interface ItemData {
  id: number;
  sex: string;
  firstName: string;
  lastName: string;
  function: string;
}
