import { Component } from '@angular/core';
import { Support } from '../../../models/support';
import { HttpService } from '../../../services/http.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../services/notification.service';
import { RoleService } from '../../../services/role.service';
import { LoggerService, log } from '../../../services/logger.service';

@Component({
  selector: 'bug-report',
  templateUrl: './bug-report.component.html',
  styleUrl: './bug-report.component.scss'
})
export class BugReportComponent {
  support: Support = {};
  ofs: string[] = [
    "date-view",
    "MAIN-LIST",
    "req-tech",
    "req-visitors",
    "req-workshop",
    "final-reports",
    "new-tech",
    "new-re",
    "new-de",
    "lan-sel",
    "bookingRequest",
    "dashboard",
    "support"];

  constructor(public translate: TranslateService, private http: HttpService,
    private notificationService: NotificationService, public roleService: RoleService, private LOG: LoggerService) {
    if (this.support.errorMessageConsole === null || this.support.errorMessageConsole === undefined) {
      this.support.errorMessageConsole = this.LOG.getPerformanceHistory().slice(-10).toString();
    }
  }

  postSupport() {
    this.support.time = new Date();
    this.support.applicant = this.roleService.getUserName();
    console.log(this.support);

    if (this.checkRequired()) {
      this.getNotification(1);
      this.http.postSupport(this.support).subscribe({
        next: data => {
          this.support = data;
        },
        error: err => {
          log("bug-report: ", err)
        }
      });
    }
  }

  checkRequired(): boolean {
    var requiredFields: string[] = [
      (this.support?.userText === null || this.support?.userText === undefined) ? "SUPPORT.message" : ""]
      .filter(element => element !== "");

    if (requiredFields.length !== 0) {
      this.getNotification(2)
    }
    return requiredFields.length === 0;
  }

  getNotification(type: number) {
    switch (type) {
      case 1: { //Error wurde gesendet
        this.translate.get('STANDARD.form_sent').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(0, translatedMessage, '', 'topRight');
        }); break;
      }
      case 2: { //Pflichtfelder ausfüllen
        this.translate.get('STANDARD.please_fill_required_fields').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(4, translatedMessage, '', 'topRight');
        }); break;
      }
    }
  }
}
