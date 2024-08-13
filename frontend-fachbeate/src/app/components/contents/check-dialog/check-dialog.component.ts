import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-check-dialog',
  templateUrl: './check-dialog.component.html',
  styleUrl: './check-dialog.component.scss'
})
export class CheckDialogComponent {
  constructor(public dialogRef: MatDialogRef<CheckDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: number,) { }


  closeDialog(save: boolean) {
    this.dialogRef.close(save);
  }

}
