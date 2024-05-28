import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FinalReport } from '../../../models/final-report';

@Component({
  selector: 'app-abschluss-bericht',
  templateUrl: './abschluss-bericht.component.html',
  styleUrl: './abschluss-bericht.component.scss'
})
export class AbschlussBerichtComponent {

  inputFinalReport: FinalReport = {}

  constructor(
    public dialogRef: MatDialogRef<AbschlussBerichtComponent>,
    @Inject(MAT_DIALOG_DATA) public finalReport: FinalReport
  ) { 
    this.inputFinalReport = finalReport;
    this.inputFinalReport.reasonReports=[];
    this.inputFinalReport.reason?.forEach(element => {
      if(element !== 0){
        this.inputFinalReport.reasonReports = [...this.inputFinalReport.reasonReports!, {reason: element}]
      }
    });
    
  }
  closeDialog(save: boolean) {
    this.dialogRef.close({finalReport: this.finalReport, save: save});
  }

}
