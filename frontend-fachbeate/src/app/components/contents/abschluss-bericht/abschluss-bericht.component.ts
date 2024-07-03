import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FinalReport } from '../../../models/final-report';
import { ReasonReport } from '../../../models/reason-report';
import { HttpService } from '../../../services/http.service';
import { Article } from '../../../models/article';
import { NzNotificationPlacement, NzNotificationService } from 'ng-zorro-antd/notification';
import { RoleService } from '../../../services/role.service';
import { Technologist } from '../../../models/technologist';
import { Representative } from '../../../models/representative';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-abschluss-bericht',
  templateUrl: './abschluss-bericht.component.html',
  styleUrl: './abschluss-bericht.component.scss'
})
export class AbschlussBerichtComponent implements OnInit {
  inputFinalReport: FinalReport = {}
  reasonSelect: number[] = []
  existingArticles: Article[] = []
  technologists: Technologist[] = [];
  representative: Representative[] = [];
  fileList: NzUploadFile[] = [];

  constructor(private msg: NzMessageService, public roleService: RoleService, private notification: NzNotificationService,
    public dialogRef: MatDialogRef<AbschlussBerichtComponent>,
    @Inject(MAT_DIALOG_DATA) public finalReport: FinalReport,
    private http: HttpService
  ) {
    this.inputFinalReport = finalReport;


    if (finalReport.reasonReports !== undefined) {
      this.inputFinalReport.reasonReports = this.inputFinalReport.reasonReports!.filter(element => element.reason !== 0);
      this.reasonSelect = this.inputFinalReport.reasonReports!.map(element => element.reason)
        .filter((reason): reason is number => reason !== undefined);
    }

  }

  ngOnInit(): void {
    this.getAllArticles();
    this.getTechnologist();
    this.getRepresentative();
  }

  changeSelections(event: any) {
    var newReasonReports: ReasonReport[] = [];
    this.reasonSelect = event.value;

    event.value.forEach((element: number) => {
      var r: ReasonReport = this.inputFinalReport.reasonReports!.find(p => p.reason === element)!

      if (r !== null && r !== undefined) {
        newReasonReports = [...newReasonReports, r]
      } else {
        newReasonReports = [...newReasonReports, { reason: element, presentedArticle: [] }]
      }
    })
    this.inputFinalReport.reasonReports = newReasonReports;

  }

  createBasicNotification(notificationStyle: number, text: string, text2: string, position: NzNotificationPlacement): void {
    if (notificationStyle === 1) {
      this.notification.warning(
        text, text2,
        { nzPlacement: position }
      );
    }
    else {
      this.notification.success(
        text, text2,
        { nzPlacement: position }
      );
    }
  }

  getAllArticles() {
    this.http.getAllArticles().subscribe({
      next: data => this.existingArticles = data,
      error: err => console.log(err)
    })
  }

  insertOther(article: Article, reason: number) {
    var tmpArticle = this.existingArticles.find(element => element.articleNr!.toString() === article.articleNr!.toString());

    if (tmpArticle !== undefined) {
      this.inputFinalReport.reasonReports!.find(element => element.reason === reason)!
        .presentedArticle.find(element => element.articleNr!.toString() === article.articleNr!.toString())!.name = tmpArticle.name;

      this.inputFinalReport.reasonReports!.find(element => element.reason === reason)!
        .presentedArticle.find(element => element.articleNr!.toString() === article.articleNr!.toString())!.id = tmpArticle.id;
    }
  }

  closeDialog(save: boolean) {
    this.dialogRef.close({ finalReport: this.finalReport, save: save });
  }

  addArticle(reason: number) {
    var reasonReport = this.finalReport.reasonReports!.find(element => element.reason === reason)!
    reasonReport.presentedArticle = [...reasonReport.presentedArticle!, {}]
  }

  deleteArticle(reason: number) {
    this.inputFinalReport.reasonReports?.find(element => element.reason === reason)?.presentedArticle.pop();
  }

  getTechnologist() {
    this.http.getActiveTechnologist().subscribe({
      next: data => {
        this.technologists = data;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  getRepresentative() {
    this.http.getActiveRepresentative().subscribe({
      next: data => {
        this.representative = data;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  changeTechnolgist($event: any) {
    this.inputFinalReport.technologist = this.technologists.find(elemnt => elemnt.id === $event);
  }

  changeRepresentative($event: any) {
    this.inputFinalReport.representative = this.representative.find(elemnt => elemnt.id === $event);
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    if (this.fileList.length >= 10) {
      this.msg.error('You can only upload up to 10 files.');
      return false;
    }
    this.fileList = [...this.fileList, file];
    return false;
  };

  handleChange(info: { file: NzUploadFile, fileList: NzUploadFile[] }): void {
    const fileList = info.fileList.slice(-10);
    this.fileList = fileList;
  }
}