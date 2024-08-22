import { Component, Inject, OnInit, input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FinalReport } from '../../../models/final-report';
import { ReasonReport } from '../../../models/reason-report';
import { HttpService } from '../../../services/http.service';
import { Article } from '../../../models/article';
import { NzNotificationPlacement, NzNotificationService } from 'ng-zorro-antd/notification';
import { RoleService } from '../../../services/role.service';
import { Representative } from '../../../models/representative';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../services/notification.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { TechDateDTO } from '../../../models/tech-date-dto';
import { log } from '../../../app.module';

@Component({
  selector: 'app-abschluss-bericht',
  templateUrl: './abschluss-bericht.component.html',
  styleUrl: './abschluss-bericht.component.scss'
})
export class AbschlussBerichtComponent implements OnInit {
  control = new FormControl(null, Validators.required);
  inputFinalReport: FinalReport = {
    reworkToDo: []
  }

  multiSelect: number[] = [];
  reasonSelect: number[] = [];

  existingArticles: Article[] = []
  technologists: TechDateDTO[] = [];
  representative: Representative[] = [];
  fileList: NzUploadFile[] = [];
  todoList = [
    { id: 1, name: 'ABSCHLUSSBERICHT.information' },
    { id: 2, name: 'ABSCHLUSSBERICHT.recipe_optimization' },
    { id: 3, name: 'ABSCHLUSSBERICHT.product_development' }
  ];

  constructor(public roleService: RoleService, private notification: NzNotificationService, private msg: NzMessageService,
    public dialogRef: MatDialogRef<AbschlussBerichtComponent>,
    @Inject(MAT_DIALOG_DATA) public finalReport: FinalReport,
    private http: HttpService, public translate: TranslateService,
    private notificationService: NotificationService
  ) {
    this.inputFinalReport = finalReport;
    //region convert into numberlist for selections
    this.inputFinalReport.reworkToDo = [
      (this.inputFinalReport.reworkInformation) ? 1 : 0,
      (this.inputFinalReport.reworkRecipe_optimization) ? 2 : 0,
      (this.inputFinalReport.reworkProduct_development) ? 3 : 0
    ].filter(element => element != 0);

    this.reasonSelect = [
      (this.inputFinalReport.presentationOfNewProducts) ? 1 : 0,
      (this.inputFinalReport.existingProducts) ? 2 : 0,
      (this.inputFinalReport.recipeOptimization) ? 3 : 0,
      (this.inputFinalReport.sampleProduction) ? 4 : 0,
      (this.inputFinalReport.training) ? 5 : 0
    ]

    if (finalReport.reasonReports !== undefined) {
      this.inputFinalReport.reasonReports = this.inputFinalReport.reasonReports!.filter(element => (element.reason !== 0 && element.reason !== 5));
      this.multiSelect = this.inputFinalReport.reasonReports!.map(element => element.reason)
        .filter((reason): reason is number => reason !== undefined);

      if (finalReport.id === undefined || finalReport.id === 0) {
        this.finalReport.reasonReports!.forEach(reasonReport => {
          if (reasonReport.presentedArticle === undefined || reasonReport.presentedArticle.length === 0) {
            reasonReport.presentedArticle = [{}]
          }
        });
      }
    }
    // endregion


  }

  ngOnInit(): void {
    this.getAllArticles();
    this.getTechnologist();
    this.getRepresentative();
  }

  changeSelections(event: any) {
    var newReasonReports: ReasonReport[] = [];
    this.multiSelect = event.value;

    event.value.forEach((element: number) => {
      var r: ReasonReport = this.inputFinalReport.reasonReports!.find(p => p.reason === element)!
      // check if reasonreport allready exist
      if (r !== null && r !== undefined) {
        newReasonReports = [...newReasonReports, r]
      } else {
        // if not existing
        newReasonReports = [...newReasonReports, { reason: element, presentedArticle: [{}] }]
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
      error: err => {
        log("abschluss-bericht: ", err)
      }
    })
  }

  isExisting(article: Article) {
    if (article !== null && article !== undefined && article.articleNr !== null && article.articleNr !== undefined) {
      return this.existingArticles.find(element => element.articleNr === article.articleNr) !== undefined;
    }
    return false;
  }

  insertOther(article: Article, reason: number) {
    //region Set Article if the ArticleNr is already existing
    var tmpArticle = this.existingArticles.find(element => element.articleNr === article.articleNr);

    this.inputFinalReport.reasonReports!.find(element => element.reason === reason)!
      .presentedArticle.find(element => element.articleNr!.toString() === article.articleNr!.toString())!.id = 0;

    if (tmpArticle !== undefined) {
      this.inputFinalReport.reasonReports!.find(element => element.reason === reason)!
        .presentedArticle.find(element => element.articleNr!.toString() === article.articleNr!.toString())!.name = tmpArticle.name;

    }
    //endregion

  }

  closeDialog(save: boolean) {

    if (this.checkRequired() || save === false) {
      //region Filter out all empty Articles
      this.inputFinalReport.reasonReports = this.inputFinalReport.reasonReports!.filter(reasonReport => reasonReport !== null && reasonReport !== undefined);

      this.inputFinalReport.reasonReports.forEach(element => {
        element.presentedArticle = element.presentedArticle.filter(article =>
          (article.articleNr !== null && article.articleNr !== undefined) ||
          (article.name !== null && article.name !== undefined && article.name !== "")
        );
      });
      //endregion

      //region Set the creator and last Editor
      this.inputFinalReport.lastEditor = this.roleService.getUserName();
      if (this.inputFinalReport.creator === undefined) {
        this.inputFinalReport.creator = this.roleService.getUserName();
      }
      //endregion

      //region set boolean for reasonselection
      this.inputFinalReport.reworkInformation = this.inputFinalReport.reworkToDo!.includes(1);
      this.inputFinalReport.reworkRecipe_optimization = this.inputFinalReport.reworkToDo!.includes(2);
      this.inputFinalReport.reworkProduct_development = this.inputFinalReport.reworkToDo!.includes(3);
      //endregion

      //region edit ckeck from Technologist and Representative
      if (this.roleService.checkPermission([3])) {
        this.inputFinalReport.representativeEntered = true;
      } else if (this.roleService.checkPermission([4])) {
        this.inputFinalReport.technologistEntered = true;
      }
      //endregion

      this.dialogRef.close({ finalReport: this.inputFinalReport, save: save });
    }
  }

  addArticle(reason: number) {
    var reasonReport = this.finalReport.reasonReports!.find(element => element.reason === reason)!
    reasonReport.presentedArticle = [...reasonReport.presentedArticle!, {}]
  }

  deleteArticle(reason: number) {
    this.inputFinalReport.reasonReports?.find(element => element.reason === reason)?.presentedArticle.pop();
  }

  getTechnologist() {
    this.http.getActiveWithDates().subscribe({
      next: data => {
        this.technologists = data;
      },
      error: err => {
        log("abschluss-bericht: ", err)
      }
    });
  }

  getRepresentative() {
    this.http.getActiveRepresentative().subscribe({
      next: data => {
        this.representative = data;
      },
      error: err => {
        log("abschluss-bericht: ", err)
      }
    });
  }

  checkRequired(): boolean {
    var requiredFields: string[] = [
      (this.inputFinalReport.technologist === null || this.inputFinalReport.technologist === undefined) ? "MAIN_LIST.advisor" : "",
      (this.inputFinalReport.representative === null || this.inputFinalReport.representative === undefined) ? "MAIN_LIST.representative" : "",
      (this.inputFinalReport.company === null || this.inputFinalReport.company === undefined || this.inputFinalReport.company === "") ? "ABSCHLUSSBERICHT.company" : "",
      (this.inputFinalReport.summaryFinalReport === null || this.inputFinalReport.summaryFinalReport === undefined || this.inputFinalReport.summaryFinalReport === "") ? "ABSCHLUSSBERICHT.representative_summary" : "",
      (this.inputFinalReport.dateOfVisit === null || this.inputFinalReport.dateOfVisit === undefined) ? "ABSCHLUSSBERICHT.visit_date_general" : "",
      (this.multiSelect === null || this.multiSelect === undefined || this.multiSelect.length === 0) ? "ABSCHLUSSBERICHT.visit_reason_general" : "",
      (this.inputFinalReport.reworkByTechnologist === null || this.inputFinalReport.reworkByTechnologist === undefined) ? "ABSCHLUSSBERICHT.advisor_follow_up" : "",
      (this.inputFinalReport.reworkByTechnologist === true && (this.inputFinalReport.reworkByTechnologistDoneUntil === null || this.inputFinalReport.reworkByTechnologistDoneUntil === undefined)) ? "ABSCHLUSSBERICHT.to_be_done_by" : "",
      (this.inputFinalReport.reworkByTechnologist === true && (this.inputFinalReport.reworkToDo === null || this.inputFinalReport.reworkToDo === undefined || this.inputFinalReport.reworkToDo.length === 0)) ? "ABSCHLUSSBERICHT.todo" : "",
      (this.inputFinalReport.reworkFollowVisits === null || this.inputFinalReport.reworkFollowVisits === undefined) ? "ABSCHLUSSBERICHT.follow_Visit" : "",
      (this.inputFinalReport.reasonReports!.filter(reasonReport => reasonReport.presentedArticle.filter(article => ((article.articleNr === null || article.articleNr === undefined) || (article.name === null || article.name === undefined || article.name === ""))).length > 0).length > 0) ? "ABSCHLUSSBERICHT.article" : "",
      (this.inputFinalReport.reasonReports!.filter(reasonReport => reasonReport.presentedArticle.filter(article => ((article.articleNr !== null && article.articleNr !== undefined) && article.articleNr!.toString().length !== 7)).length > 0).length > 0) ? "ABSCHLUSSBERICHT.article_length" : ""
    ].filter(element => element !== "");

    if (requiredFields.length !== 0) {
      this.translate.get(['STANDARD.please_fill_required_fields', ...requiredFields.map(element => element)]).subscribe(translations => {
        const message = translations['STANDARD.please_fill_required_fields'];
        const anotherMessage = requiredFields.map(element => translations[element]).toString();
        this.notificationService.createBasicNotification(4, message, anotherMessage, 'topRight');
      });
    }

    return requiredFields.length === 0;
  }

  changeTechnolgist($event: any) {
    this.inputFinalReport.technologist = this.technologists.find(elemnt => elemnt.technologist.id === $event)!.technologist
    ;
  }

  changeRepresentative($event: any) {
    this.inputFinalReport.representative = this.representative.find(elemnt => elemnt.id === $event);
  }

  getNotification(type: number) {
    switch (type) {
      case 0: { //Files hochgeladen
        this.translate.get('ABSCHLUSSBERICHT.files_uploaded').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(0, translatedMessage, '', 'topRight');
        });
        break;
      }
      case 1: { //Files nicht erlaubt
        this.translate.get(['ABSCHLUSSBERICHT.files_allowed', 'ABSCHLUSSBERICHT.files_allowed_2'])
          .subscribe((translations: { [key: string]: string }) => {
            const message1 = translations['ABSCHLUSSBERICHT.files_allowed'];
            const message2 = translations['ABSCHLUSSBERICHT.files_allowed_2'];
            this.notificationService.createBasicNotification(4, message1, message2, 'topRight');
          });
        break;
      }
      case 2: { // maximal 5 Files
        this.translate.get(['ABSCHLUSSBERICHT.files_count', 'ABSCHLUSSBERICHT.files_count_2'])
          .subscribe((translations: { [key: string]: string }) => {
            const message1 = translations['ABSCHLUSSBERICHT.files_count'];
            const message2 = translations['ABSCHLUSSBERICHT.files_count_2'];
            this.notificationService.createBasicNotification(4, message1, message2, 'topRight');
          });
        break;
      }
      case 3: { //maximal 2 MB per file
        this.translate.get(['ABSCHLUSSBERICHT.files_size', 'ABSCHLUSSBERICHT.files_size_2'])
          .subscribe((translations: { [key: string]: string }) => {
            const message1 = translations['ABSCHLUSSBERICHT.files_size'];
            const message2 = translations['ABSCHLUSSBERICHT.files_size_2'];
            this.notificationService.createBasicNotification(4, message1, message2, 'topRight');
          });
        break;
      }
    }
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    const icCorrectFileType = file.type === 'application/pdf' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/heif';
    const isLt2M = file.size! / 1024 / 1024 < 1;

    if (!icCorrectFileType) {
      this.getNotification(1);
      return false;
    }
    if (this.fileList.length >= 5) {
      this.getNotification(2);
      return false;
    }
    if (!isLt2M) {
      this.getNotification(3);
      return false;
    }
    // Datei zur Liste hinzufügen
    this.fileList = [...this.fileList, file];
    this.getNotification(0);
    return true;
  };

  handleChange(info: { fileList: NzUploadFile[] }): void {
    const fileList = info.fileList.slice(-10);
    this.fileList = fileList;
  }
}
