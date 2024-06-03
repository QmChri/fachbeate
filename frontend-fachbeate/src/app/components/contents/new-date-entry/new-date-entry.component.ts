import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbschlussBerichtComponent } from '../abschluss-bericht/abschluss-bericht.component';
import { Technologist } from '../../../models/technologist';
import { HttpService } from '../../../services/http.service';
import { TechnologistAppointment } from '../../../models/technologist-appointment';

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

  inputDate: TechnologistAppointment = {};
  technologists: Technologist[] = [];

  constructor(public dialogRef: MatDialogRef<AbschlussBerichtComponent>,
     @Inject(MAT_DIALOG_DATA) public timeSpan: TechnologistAppointment,
     private http: HttpService
    ) {
  }
  ngOnInit(): void {

    this.inputDate.startDate = this.timeSpan.startDate;

    if(this.timeSpan.id !== null && this.timeSpan.id !== undefined && this.timeSpan.id !== 0){
      this.inputDate.id = this.timeSpan.id;
      this.inputDate.endDate = this.timeSpan.endDate;
      this.inputDate.reason = this.timeSpan.reason;
      this.inputDate.requestedTechnologist = this.timeSpan.requestedTechnologist;
    }else{
      this.inputDate.endDate = this.adjustEndDate(this.timeSpan.endDate!.toString())
    }


    this.getTechnologists();
  }

  addToList(addItem: string){
    this.reasons.push(addItem);
  }

  getTechnologists(){
    this.http.getActiveTechnologist().subscribe({
      next: data => {
        this.technologists = data;
      },
      error: err => {
        console.log(err);
      }
    });
  }
  closeDialog(save: boolean) {
    this.dialogRef.close({ dialogRef: this.dialogRef, save: save });
  }

  save(){

    this.http.postOtherDate(this.inputDate).subscribe({

    });

  }

  adjustEndDate(endDate: string): Date {
    const date = new Date(endDate);
    date.setDate(date.getDate() - 1);
    return new Date(date.toISOString().split('T')[0]);
  }


  changeTechnolgist($event: any) {
    this.inputDate.requestedTechnologist = this.technologists.find(elemnt => elemnt.id === $event);
  }

}
