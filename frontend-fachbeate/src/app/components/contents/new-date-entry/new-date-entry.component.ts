import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbschlussBerichtComponent } from '../abschluss-bericht/abschluss-bericht.component';

@Component({
  selector: 'app-new-date-entry',
  templateUrl: './new-date-entry.component.html',
  styleUrl: './new-date-entry.component.scss'
})
export class NewDateEntryComponent implements OnInit {

  addItem: string = "";
  reasonSelect: number = 0;
  reasons: string[] = ['Urlaub',
    'Zeitausgleich',
    'Vorläufige Kundenreservierung',
    'Seminar',
    'Messe',
    'HomeOffice',
    'Haus Oftering',
    'Kundenbesuch'];

  inputDate: { start?: string, end?: string, text?: String } = {}

  constructor(public dialogRef: MatDialogRef<AbschlussBerichtComponent>, @Inject(MAT_DIALOG_DATA) public timeSpan: { start: string, end: string }) {
  }
  ngOnInit(): void {
    this.inputDate.start = this.timeSpan.start;
    this.inputDate.end = this.timeSpan.end;
  }

  addToList(addItem: string){
    this.reasons.push(addItem);
  }

  test() {
    console.log(this.inputDate)
  }
  closeDialog(save: boolean) {
    this.dialogRef.close({ dialogRef: this.dialogRef, save: save });
  }

}
