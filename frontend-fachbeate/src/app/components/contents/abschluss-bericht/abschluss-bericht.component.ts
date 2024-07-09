import { Component, Inject, OnInit, input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FinalReport } from '../../../models/final-report';
import { ReasonReport } from '../../../models/reason-report';
import { HttpService } from '../../../services/http.service';
import { Article } from '../../../models/article';
import { NzNotificationPlacement, NzNotificationService } from 'ng-zorro-antd/notification';
import { RoleService } from '../../../services/role.service';
import { Technologist } from '../../../models/technologist';
import { Representative } from '../../../models/representative';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../services/notification.service';

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
  reasonSelect: number[] = []
  existingArticles: Article[] = []
  technologists: Technologist[] = [];
  representative: Representative[] = [];
  todoList = [
    { id: 1, name: 'ABSCHLUSSBERICHT.information' },
    { id: 2, name: 'ABSCHLUSSBERICHT.recipe_optimization' },
    { id: 3, name: 'ABSCHLUSSBERICHT.product_development' }
  ]; 

 constructor(public roleService: RoleService,private notification: NzNotificationService,
    public dialogRef: MatDialogRef<AbschlussBerichtComponent>,
    @Inject(MAT_DIALOG_DATA) public finalReport: FinalReport,
    private http: HttpService, public translate: TranslateService,
    private notificationService: NotificationService
  ) {
    this.inputFinalReport = finalReport;

    this.inputFinalReport.reworkToDo = [
      (this.inputFinalReport.reworkInformation)?1:0,
      (this.inputFinalReport.reworkRecipe_optimization)?2:0,
      (this.inputFinalReport.reworkProduct_development)?3:0
    ].filter(element => element != 0);

    if (finalReport.reasonReports !== undefined) {
      this.inputFinalReport.reasonReports = this.inputFinalReport.reasonReports!.filter(element => element.reason !== 0);
      this.reasonSelect = this.inputFinalReport.reasonReports!.map(element => element.reason)
        .filter((reason): reason is number => reason !== undefined);
      if(finalReport.id === undefined || finalReport.id === 0){
        this.finalReport.reasonReports!.forEach(reasonReport => {          
          if(reasonReport.presentedArticle === undefined || reasonReport.presentedArticle.length === 0 ){            
            reasonReport.presentedArticle = [{}]
          }
        });
      }
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

    console.log(this.inputFinalReport);
    

    if(this.checkRequired())  {
      this.inputFinalReport.lastEditor = this.roleService.getUserName();
      if(this.inputFinalReport.creator === undefined){
        this.inputFinalReport.creator = this.roleService.getUserName();
      }
      
      this.inputFinalReport.reworkInformation = this.inputFinalReport.reworkToDo!.includes(1);
      this.inputFinalReport.reworkRecipe_optimization = this.inputFinalReport.reworkToDo!.includes(2);
      this.inputFinalReport.reworkProduct_development = this.inputFinalReport.reworkToDo!.includes(3);

      if(this.roleService.checkPermission([3])){
        this.inputFinalReport.representativeEntered = true;
      }else if(this.roleService.checkPermission([4])){
        this.inputFinalReport.technologistEntered = true;
      }

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

  checkRequired():boolean{
    var requiredFields: string[] = [
      (this.inputFinalReport.technologist === null||this.inputFinalReport.technologist === undefined)?"MAIN_LIST.advisor":"",
      (this.inputFinalReport.representative === null||this.inputFinalReport.representative === undefined)?"MAIN_LIST.representative":"",
      (this.inputFinalReport.company === null || this.inputFinalReport.company === undefined||this.inputFinalReport.company === "")?"ABSCHLUSSBERICHT.company":"",
      (this.inputFinalReport.dateOfVisit === null||this.inputFinalReport.dateOfVisit === undefined)?"ABSCHLUSSBERICHT.visit_date_general":"",
      (this.reasonSelect === null||this.reasonSelect === undefined||this.reasonSelect.length === 0)?"ABSCHLUSSBERICHT.visit_reason_general":"",
      (this.inputFinalReport.reworkByTechnologist === null || this.inputFinalReport.reworkByTechnologist === undefined)?"ABSCHLUSSBERICHT.advisor_follow_up":"",
      (this.inputFinalReport.reworkByTechnologist === true && (this.inputFinalReport.reworkByTechnologistDoneUntil === null || this.inputFinalReport.reworkByTechnologistDoneUntil === undefined))?"ABSCHLUSSBERICHT.to_be_done_by":"",
      (this.inputFinalReport.reworkByTechnologist === true && (this.inputFinalReport.reworkToDo === null || this.inputFinalReport.reworkToDo === undefined || this.inputFinalReport.reworkToDo.length === 0))?"ABSCHLUSSBERICHT.todo":"",
      (this.inputFinalReport.reworkByTechnologist === true && (this.inputFinalReport.reworkFollowVisits === null || this.inputFinalReport.reworkFollowVisits === undefined))?"ABSCHLUSSBERICHT.follow_Visit":"",
    ].filter(element => element !== "");

    if(requiredFields.length !== 0){
      this.translate.get(['STANDARD.please_fill_required_fields', ...requiredFields.map(element => element)]).subscribe(translations => {
        const message = translations['STANDARD.please_fill_required_fields'];
        const anotherMessage = requiredFields.map(element => translations[element]).toString();
        this.notificationService.createBasicNotification(4, message, anotherMessage, 'topRight');
      });
    }

    return requiredFields.length === 0;
  }

  changeTechnolgist($event: any) {
    this.inputFinalReport.technologist = this.technologists.find(elemnt => elemnt.id === $event);
  }

  changeRepresentative($event: any) {
    this.inputFinalReport.representative = this.representative.find(elemnt => elemnt.id === $event);
  }
}
