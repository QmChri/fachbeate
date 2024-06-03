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

  reasonSelect: number[] = []
  buttonSelect: string[] = []

  changeSelections(event: any, section: number) {
    this.buttonSelect = (section === 0) ? this.buttonSelect.filter(number => Number(number) >= 6 && Number(number) <= 7) : this.buttonSelect.filter(number => Number(number) >= 1 && Number(number) <= 5);
    this.buttonSelect = [...this.buttonSelect, ...event.value]
  }
  constructor(
    public dialogRef: MatDialogRef<AbschlussBerichtComponent>,
    @Inject(MAT_DIALOG_DATA) public finalReport: FinalReport
  ) {
    this.inputFinalReport = finalReport;

    if (finalReport.reasonReports !== undefined) {
      this.inputFinalReport.reasonReports = this.inputFinalReport.reasonReports!.filter(element => element.reason !== 0);
      this.reasonSelect = this.inputFinalReport.reasonReports!.map(element => element.reason)
        .filter((reason): reason is number => reason !== undefined);
      ;

      console.log("resonselect")
      console.log(this.reasonSelect);
    }

  }
  closeDialog(save: boolean) {
    this.dialogRef.close({ finalReport: this.finalReport, save: save });
  }
  //closeDialog(save: boolean) { }
}
