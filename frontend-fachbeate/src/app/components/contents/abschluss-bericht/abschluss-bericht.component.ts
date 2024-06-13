import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FinalReport } from '../../../models/final-report';
import { ReasonReport } from '../../../models/reason-report';

@Component({
  selector: 'app-abschluss-bericht',
  templateUrl: './abschluss-bericht.component.html',
  styleUrl: './abschluss-bericht.component.scss'
})
export class AbschlussBerichtComponent {

  inputFinalReport: FinalReport = {}

  reasonSelect: number[] = []
  
  changeSelections(event: any) {
    var newReasonReports: ReasonReport[] = [];

    this.reasonSelect = event.value;

    event.value.forEach((element: number) => {
      var r: ReasonReport = this.inputFinalReport.reasonReports!.find(p => p.reason === element)!
      
      if(r !== null && r !== undefined){
        newReasonReports = [...newReasonReports, r]
      }else{
        newReasonReports = [...newReasonReports, {reason: element, presentedArticle: []}]
      }

    })
    this.inputFinalReport.reasonReports = newReasonReports;
    
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
    }

  }
  closeDialog(save: boolean) {
    this.dialogRef.close({ finalReport: this.finalReport, save: save });
  }


  addArticle(reason: number){
    var reasonReport = this.finalReport.reasonReports!.find(element => element.reason === reason)!
    reasonReport.presentedArticle = [...reasonReport.presentedArticle!, {}]
  }

  //closeDialog(save: boolean) { }
}
