import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-abschluss-bericht',
  templateUrl: './abschluss-bericht.component.html',
  styleUrl: './abschluss-bericht.component.scss'
})
export class AbschlussBerichtComponent {
  constructor(
    public dialogRef: MatDialogRef<AbschlussBerichtComponent>,
  ) { }
  closeDialog() {
    this.dialogRef.close();
  }
}
