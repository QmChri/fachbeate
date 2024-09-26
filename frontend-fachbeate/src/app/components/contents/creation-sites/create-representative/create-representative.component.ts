import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { Representative } from '../../../../models/representative';
import { NotificationService } from '../../../../services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { log } from '../../../../services/logger.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NzCustomColumn } from 'ng-zorro-antd/table';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-create-representative',
  templateUrl: './create-representative.component.html',
  styleUrl: './create-representative.component.scss'
})
export class CreateRepresentativeComponent implements OnInit {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  control = new FormControl(null, Validators.required);
  matcher = new MyErrorStateMatcher();

  inputRepresentative: Representative = {
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    active: true,
  }
  customColumn: CustomColumn[] = [
    {
      name: 'Name',
      value: 'name',
      default: true,
      required: true,
      position: 'left',
      width: 200,
      fixWidth: true
    }
  ];
  dadLeft: CustomColumn[] = [];
  dadRight: CustomColumn[] = [];
  representativeList: Representative[] = [];
  public pageSize: number = 9;
  searchValue = '';
  visible = false;

  constructor(public translate: TranslateService, private http: HttpService, private notificationService: NotificationService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadRepresentatives();
    this.dadLeft = this.customColumn.filter(item => item.default && !item.required);
    this.dadRight = this.customColumn.filter(item => !item.default && !item.required);
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

  loadRepresentatives() {
    this.http.getAllRepresentative().subscribe({
      next: data => {
        this.representativeList = data
      },
      error: err => {
        log("create-representative: ", err)
      }
    })
  }

  postRepresentative() {
    if (!this.inputRepresentative.firstName || this.inputRepresentative.firstName === ""
      || !this.inputRepresentative.lastName || this.inputRepresentative.lastName === ""
      || !this.emailFormControl.valid || !this.inputRepresentative.email) {
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
      if (this.isDuplicateRepresentative(this.inputRepresentative)) {
        this.translate.get('CREATION_SITES.already_exists_R').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(4, translatedMessage, '', 'topRight');
        });
        return
      }
      if (this.isDuplicateEmail(this.inputRepresentative)) {
        this.translate.get('CREATION_SITES.already_Mail').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(4, translatedMessage, '', 'topRight');
        });
        return
      }
      else {
        this.http.postRepresentative(
          {
            id: this.inputRepresentative.id!,
            firstName: this.inputRepresentative.firstName!,
            lastName: this.inputRepresentative.lastName,
            email: this.inputRepresentative.email,
            active: this.inputRepresentative.active
          }).subscribe({
            next: data => {
              if (this.inputRepresentative.id !== null && this.inputRepresentative.id !== undefined && this.inputRepresentative.id !== 0) {
                this.translate.get('CREATION_SITES.already_exists_updated_R').subscribe((translatedMessage: string) => {
                  this.notificationService.createBasicNotification(0, translatedMessage, this.inputRepresentative.firstName + ' ' +
                    this.inputRepresentative.lastName, 'topRight');
                });
              }
              else {
                this.translate.get('STANDARD.new_representative_created').subscribe((translatedMessage: string) => {
                  this.notificationService.createBasicNotification(0, translatedMessage, this.inputRepresentative.firstName + ' ' +
                    this.inputRepresentative.lastName, 'topRight');
                });
              }
              this.inputRepresentative = {
                id: 0,
                firstName: "",
                lastName: "",
                email: "",
                active: true
              }

              this.loadRepresentatives();
            },
            error: err => {
              log("create-representative: ", err)
            }
          });
      }
    }
  }

  isDuplicateRepresentative(frep: Representative): boolean {
    var found: Representative | undefined = this.representativeList.find(representative =>
      representative.firstName === frep.firstName && representative.lastName === frep.lastName
    );;

    if ((this.inputRepresentative.id !== null && this.inputRepresentative.id !== undefined && this.inputRepresentative.id !== 0)) {
      if (found !== undefined) {
        if (found.id !== frep.id) {
          return true;
        }
      }

      return false;
    }
    return found !== undefined;
  }

  isDuplicateEmail(rep: Representative): boolean {
    var found: Representative | undefined = this.representativeList.find(representative => representative.email === rep.email);

    if ((this.inputRepresentative.id !== null && this.inputRepresentative.id !== undefined && this.inputRepresentative.id !== 0)) {
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
    this.inputRepresentative = {
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      active: true,
    }
    this.dadLeft = []
    this.dadRight = []
  }

  editRow(id: number, type: number) {
    const representative: Representative = this.representativeList.find(element => element.id === id)!;
    this.inputRepresentative.id = representative.id;
    this.inputRepresentative.firstName = representative.firstName;
    this.inputRepresentative.lastName = representative.lastName;
    this.inputRepresentative.email = representative.email;
    this.inputRepresentative.active = representative.active;
    this.dadLeft = [];
    this.representativeList.filter(rep => rep.id !== representative.id).forEach(rep => {
      this.dadLeft.push({
        name: `${rep.firstName} ${rep.lastName}`,
        value: `${rep.firstName!.toLowerCase()}.${rep.lastName!.toLowerCase()}`,
        default: false,
        required: false,
        position: 'right',
        width: 150,
        fixWidth: false
      });
    });
  }

  drop(event: CdkDragDrop<CustomColumn[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    this.dadLeft = this.dadLeft.map(item => {
      item.default = true;
      return item;
    });
    this.dadRight = this.dadRight.map(item => {
      item.default = false;
      return item;
    });
    this.cdr.markForCheck();
  }

  deleteCustom(value: CustomColumn, index: number): void {
    value.default = false;
    this.dadRight = [...this.dadRight, value];
    this.dadLeft.splice(index, 1);
    this.cdr.markForCheck();
  }

  addCustom(value: CustomColumn, index: number): void {
    value.default = true;
    this.dadLeft = [...this.dadLeft, value];
    this.dadRight.splice(index, 1);
    this.cdr.markForCheck();
  }

  handleOk(): void {
    this.customColumn = [...this.dadLeft, ...this.dadRight];
    this.cdr.markForCheck();
  }

  resetSearch(): void {
    this.searchValue = "";
    this.translate.get('STANDARD.filter_sorting_removed').subscribe((translatedMessage: string) => {
      this.notificationService.createBasicNotification(2, translatedMessage, '', 'topRight');
    });
    this.loadRepresentatives();
  }

  search(): void {
    this.visible = false;
    this.representativeList = this.representativeList.filter((item: Representative) =>
    (
      item.firstName!.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.lastName!.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.email!.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.id!.valueOf().toString().includes(this.searchValue.toLocaleLowerCase())
    ));
  }
}

interface CustomColumn extends NzCustomColumn {
  name: string;
  required?: boolean;
  position?: 'left' | 'right';
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}