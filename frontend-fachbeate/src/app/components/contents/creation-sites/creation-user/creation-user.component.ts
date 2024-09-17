import { Component, HostListener, OnInit } from '@angular/core';
import { MailUser } from '../../../../models/other-user';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from '../../../../services/http.service';
import { NotificationService } from '../../../../services/notification.service';
import { log } from '../../../../services/logger.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-creation-user',
  templateUrl: './creation-user.component.html',
  styleUrl: './creation-user.component.scss'
})
export class CreatMailUserComponent implements OnInit {
  control = new FormControl(null, Validators.required);
  inputMailUsers: MailUser = {
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    active: true,
  }
  mailUserList: MailUser[] = [];
  public pageSize: number = 9;
  searchValue = '';
  visible = false;
  functions: Functions[] = [
    { value: '0', viewValue: 'GL' },
    { value: '1', viewValue: 'AL' },
    { value: '2', viewValue: 'FrontOffice' },
  ];

  constructor(public translate: TranslateService, private http: HttpService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.loadMailUser();
    this.calculatePageSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calculatePageSize();
  }
  calculatePageSize(): void {
    const tableHeight = window.innerHeight - 254; //Puffer für Header/Footer
    const rowHeight = 54; // Höhe einer Tabellenzeile
    this.pageSize = Math.floor(tableHeight / rowHeight);
  }

  loadMailUser() {
    this.http.getAllMailUser().subscribe({
      next: data => {
        this.mailUserList = data
      },
      error: err => {
        log("create-other-users: ", err)
      }
    })
  }

  postMailUser() {
    if (!this.inputMailUsers.firstName || this.inputMailUsers.firstName === "" || !this.inputMailUsers.lastName || this.inputMailUsers.lastName === "") {
      this.translate.get(['STANDARD.please_fill_required_fields', 'STANDARD.first_and_last_name']).subscribe(translations => {
        const message = translations['STANDARD.please_fill_required_fields'];
        const anotherMessage = translations['STANDARD.first_and_last_name'];
        this.notificationService.createBasicNotification(4, message, anotherMessage, 'topRight');
      });
    }
    else {
      this.translate.get('STANDARD.new_advisor_created').subscribe((translatedMessage: string) => {
        this.notificationService.createBasicNotification(0, translatedMessage, this.inputMailUsers.firstName + ' ' +
          this.inputMailUsers.lastName, 'topRight');
      });
      this.http.postMailUser(this.inputMailUsers).subscribe({
        next: data => {
          this.inputMailUsers = {
            id: 0,
            firstName: "",
            lastName: "",
            email: "",
            active: true,
            function: ""
          }
          this.loadMailUser();
        },
        error: err => {
          log("create-technologist: ", err)
        }
      });
    }
  }

  cancelEdit() {
    this.inputMailUsers = {
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      active: true,
      function: ""
    }
  }

  editRow(id: number, type: number) {
    const mailUser: MailUser = this.mailUserList.find(element => element.id === id)!;
    this.inputMailUsers.id = mailUser.id;
    this.inputMailUsers.firstName = mailUser.firstName;
    this.inputMailUsers.lastName = mailUser.lastName;
    this.inputMailUsers.email = mailUser.email;
    this.inputMailUsers.active = mailUser.active;
    this.inputMailUsers.function = mailUser.function;
  }

  resetSearch(): void {
    this.searchValue = "";
    this.translate.get('STANDARD.filter_sorting_removed').subscribe((translatedMessage: string) => {
      this.notificationService.createBasicNotification(2, translatedMessage, '', 'topRight');
    });
    this.loadMailUser();
  }

  search(): void {
    this.visible = false;
    this.mailUserList = this.mailUserList.filter((item: MailUser) =>
    (
      item.id!.valueOf().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.firstName!.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.lastName!.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.email!.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.function!.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase())
    ));
  }
}

interface Functions {
  value: string;
  viewValue: string;
}