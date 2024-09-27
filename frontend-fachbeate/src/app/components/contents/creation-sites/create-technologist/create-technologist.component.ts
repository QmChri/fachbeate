import { Component, HostListener, input, OnInit } from '@angular/core';
import { Technologist } from '../../../../models/technologist';
import { HttpService } from '../../../../services/http.service';
import { NotificationService } from '../../../../services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { log } from '../../../../services/logger.service';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-create-technologist',
  templateUrl: './create-technologist.component.html',
  styleUrl: './create-technologist.component.scss'
})
export class CreateTechnologistComponent implements OnInit {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  control = new FormControl(null, Validators.required);
  matcher = new MyErrorStateMatcher();
  inputTechnologist: Technologist = {
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    active: true,
    color: "#ff0000"
  }
  technologistList: Technologist[] = [];
  letters = '0123456789ABCDEF';
  public pageSize: number = 9;
  searchValue = '';
  visible = false;

  constructor(public translate: TranslateService, private http: HttpService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.loadTechnologists();
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

  getRandomColor() {
    this.inputTechnologist.color = '#';
    for (var i = 0; i < 6; i++) {
      this.inputTechnologist.color += this.letters[Math.floor(Math.random() * 16)];
    }
  }

  loadTechnologists() {
    this.http.getAllTechnologist().subscribe({
      next: data => {
        this.technologistList = data
      },
      error: err => {
        log("create-technologist: ", err)
      }
    })
  }

  postTechnologist() {
    if (!this.inputTechnologist.firstName || this.inputTechnologist.firstName === ""
      || !this.inputTechnologist.lastName || this.inputTechnologist.lastName === ""
      || !this.emailFormControl.valid || !this.inputTechnologist.email) {
      this.translate.get([
        'STANDARD.please_fill_required_fields',
        'STANDARD.first_and_last_name',
        'STANDARD.email_invalid'
      ]).subscribe(translations => {
        const message = translations['STANDARD.please_fill_required_fields'];
        const anotherMessage = translations['STANDARD.first_and_last_name'];
        const thirdMessage = translations['STANDARD.email_invalid'];

        this.notificationService.createBasicNotification(4, message, anotherMessage + ' & ' + thirdMessage, 'topRight');
      });
    }

    else {
      if (this.isDuplicateTechnologist(this.inputTechnologist)) {
        this.translate.get('CREATION_SITES.already_exists_F').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(4, translatedMessage, '', 'topRight');
        });
        return
      }
      if (this.isDuplicateEmail(this.inputTechnologist)) {
        this.translate.get('CREATION_SITES.already_Mail').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(4, translatedMessage, '', 'topRight');
        });
        return
      }
      else {
        this.http.postTechnologist(this.inputTechnologist).subscribe({
          next: data => {
            if (this.inputTechnologist.id !== null && this.inputTechnologist.id !== undefined && this.inputTechnologist.id !== 0) {
              this.translate.get('CREATION_SITES.already_exists_updated_F').subscribe((translatedMessage: string) => {
                this.notificationService.createBasicNotification(0, translatedMessage, this.inputTechnologist.firstName + ' ' +
                  this.inputTechnologist.lastName, 'topRight');
              });
            }
            else {
              this.translate.get('STANDARD.new_advisor_created').subscribe((translatedMessage: string) => {
                this.notificationService.createBasicNotification(0, translatedMessage, this.inputTechnologist.firstName + ' ' +
                  this.inputTechnologist.lastName, 'topRight');
              });
            }

            this.inputTechnologist = {
              id: 0,
              firstName: "",
              lastName: "",
              email: "",
              active: true,
              color: "#000000"
            }

            this.loadTechnologists();
          },
          error: err => {
            log("create-technologist: ", err)
          }
        });
      }
    }
  }


  isDuplicateTechnologist(frep: Technologist): boolean {
    var found: Technologist | undefined = this.technologistList.find(technologist =>
      technologist.firstName === frep.firstName && technologist.lastName === frep.lastName
    );;

    if ((this.inputTechnologist.id !== null && this.inputTechnologist.id !== undefined && this.inputTechnologist.id !== 0)) {
      if (found !== undefined) {
        if (found.id !== frep.id) {
          return true;
        }
      }

      return false;
    }
    return found !== undefined;
  }

  isDuplicateEmail(rep: Technologist): boolean {
    var found: Technologist | undefined = this.technologistList.find(technologist => technologist.email === rep.email);

    if ((this.inputTechnologist.id !== null && this.inputTechnologist.id !== undefined && this.inputTechnologist.id !== 0)) {
      if (found !== undefined) {
        if (found.id !== rep.id) {
          return true;
        }
      }

      return false;
    }
    return found !== undefined;
  }


  cancelEdit() {
    this.inputTechnologist = {
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      active: true,
      color: ""
    }
  }

  editRow(id: number, type: number) {
    const technologist: Technologist = this.technologistList.find(element => element.id === id)!;
    this.inputTechnologist.id = technologist.id;
    this.inputTechnologist.firstName = technologist.firstName;
    this.inputTechnologist.lastName = technologist.lastName;
    this.inputTechnologist.email = technologist.email;
    this.inputTechnologist.active = technologist.active;
    this.inputTechnologist.color = technologist.color;
  }

  resetSearch(): void {
    this.searchValue = "";
    this.translate.get('STANDARD.filter_sorting_removed').subscribe((translatedMessage: string) => {
      this.notificationService.createBasicNotification(2, translatedMessage, '', 'topRight');
    });
    this.loadTechnologists();
  }
  search(): void {
    this.visible = false;
    this.technologistList = this.technologistList.filter((item: Technologist) =>
    (
      item.firstName!.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.lastName!.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.email!.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.color!.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.id!.valueOf().toString().includes(this.searchValue.toLocaleLowerCase())
    ));
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}