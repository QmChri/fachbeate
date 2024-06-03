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
  technologists: Technologist[] = [
    {
      id: 12,
      firstName: "asdad",
      lastName: "sdfsfd",
      active: true,
      color: '#f4f4f4'
    }
  ];

  constructor(public dialogRef: MatDialogRef<AbschlussBerichtComponent>,
    @Inject(MAT_DIALOG_DATA) public timeSpan: { start: string, end: string },
    private http: HttpService
  ) {
  }
  ngOnInit(): void {
    this.inputDate.startDate = new Date(this.timeSpan.start);
    this.inputDate.endDate = this.adjustEndDate(this.timeSpan.end);
    this.getTechnologists();
  }

  addToList(addItem: string) {
    this.reasons.push(addItem);
  }

  getTechnologists() {
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

  save() {

    this.http.postOtherDate(this.inputDate).subscribe({

    });

  }

  adjustEndDate(endDate: string): Date {
    const date = new Date(endDate);
    date.setDate(date.getDate() - 1);
    return new Date(date.toISOString().split('T')[0]);
  }

}
