import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Guest } from '../../../models/guest';

@Component({
  selector: 'app-teilnehmer-liste',
  templateUrl: './teilnehmer-liste.component.html',
  styleUrl: './teilnehmer-liste.component.scss'
})
export class TeilnehmerListeComponent implements OnInit {
  i = 1;
  editId: number | null = null;
  listOfData: Guest[] = [];

  constructor(
    public dialogRef: MatDialogRef<TeilnehmerListeComponent>,
    @Inject(MAT_DIALOG_DATA) public guests: Guest[]
  ) {
    console.log(guests);
    
    if(guests !== null && guests !== undefined){
      guests.forEach(element => this.addRow(element));
    }
  }

  startEdit(id: number): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
  }

  addRow(guest: Guest): void {
    this.listOfData = [
      ...this.listOfData,
      {
        id: guest.id,
        editId: this.i,
        sex: guest.sex,
        firstName: guest.firstName,
        lastName: guest.lastName,
        function: guest.function,
      }
    ];
    this.i++;
  }

  deleteRow(id: number): void {
    this.listOfData = this.listOfData.filter(d => d.editId !== id);
  }


  closeDialog(save: boolean) {
    if(save){
      this.dialogRef.close(this.listOfData);
    }else{
      this.dialogRef.close(undefined);
    }
  }

  ngOnInit(): void {
  }
}