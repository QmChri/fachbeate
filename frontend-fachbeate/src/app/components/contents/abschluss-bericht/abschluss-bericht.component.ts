import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FinalReport } from '../../../models/final-report';

@Component({
  selector: 'app-abschluss-bericht',
  templateUrl: './abschluss-bericht.component.html',
  styleUrl: './abschluss-bericht.component.scss'
})
export class AbschlussBerichtComponent {
  constructor(
    public dialogRef: MatDialogRef<AbschlussBerichtComponent>,
    @Inject(MAT_DIALOG_DATA) public finalReport: FinalReport
  ) { }
  closeDialog() {
    this.dialogRef.close();
  }
}
