import { Component, HostListener, OnInit } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { Company } from '../../../../models/company';
import { NotificationService } from '../../../../services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { log } from '../../../../services/logger.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-dealer',
  templateUrl: './create-dealer.component.html',
  styleUrl: './create-dealer.component.scss'
})
export class CreateDealerComponent implements OnInit {
  control = new FormControl(null, Validators.required);
  searchValue = '';
  visible = false;
  inputCompany: Company = { active: true };
  companyList: Company[] = [];
  public pageSize: number = 9;

  constructor(public translate: TranslateService, private http: HttpService, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.loadCompany();
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

  loadCompany() {
    this.http.getAllCompany().subscribe({
      next: data => {
        this.companyList = data
      },
      error: err => {
        log("create-representative: ", err)
      }
    })

  }

  postDealer() {
    if (!this.inputCompany.name || this.inputCompany.name === "" || !this.inputCompany.username || this.inputCompany.username === "") {
      this.translate.get([
        'STANDARD.please_fill_required_fields',
        'STANDARD.assigned_customer',
        'CREATION_SITES.user_name'
      ]).subscribe(translations => {
        const message = translations['STANDARD.please_fill_required_fields'];
        const anotherMessage = translations['STANDARD.assigned_customer'];
        const thirdMessage = translations['CREATION_SITES.user_name'];

        this.notificationService.createBasicNotification(4, message, anotherMessage + ' & ' + thirdMessage, 'topRight');
      });
    }
    else {
      if (this.isDuplicateDealer(this.inputCompany)) {
        this.translate.get('CREATION_SITES.already_exists_H').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(4, translatedMessage, '', 'topRight');
        });
        return
      }
      if (this.isDuplicateUserName(this.inputCompany)) {
        this.translate.get('CREATION_SITES.already_exist_username').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(4, translatedMessage, '', 'topRight');
        });
        return
      }
      else {
        this.http.postCompany(this.inputCompany).subscribe({
          next: data => {
            if (this.inputCompany.id !== null && this.inputCompany.id !== undefined && this.inputCompany.id !== 0) {
              this.translate.get('CREATION_SITES.already_exists_updated_H').subscribe((translatedMessage: string) => {
                this.notificationService.createBasicNotification(0, translatedMessage, this.inputCompany.name + ' ' +
                  this.inputCompany.username, 'topRight');
              });
            }
            else {
              this.translate.get('STANDARD.new_dealer_created').subscribe((translatedMessage: string) => {
                this.notificationService.createBasicNotification(0, translatedMessage, this.inputCompany.name!, 'topRight');
              });
            }

            this.inputCompany = {
              id: 0,
              name: "",
              username: "",
              active: true
            }

            this.loadCompany();
          },
          error: err => {
            log("create-representative: ", err)
          }
        });
      }

    }
  }

  isDuplicateDealer(frep: Company): boolean {
    var found: Company | undefined = this.companyList.find(toha =>toha.name === frep.name);;

    if ((this.inputCompany.id !== null && this.inputCompany.id !== undefined && this.inputCompany.id !== 0)) {
      if (found !== undefined) {
        if (found.id !== frep.id) {
          return true;
        }
      }

      return false;
    }
    return found !== undefined;
  }
  isDuplicateUserName(c: Company): boolean {
    var found: Company | undefined = this.companyList.find(toha => toha.username === c.username);

    if ((this.inputCompany.id !== null && this.inputCompany.id !== undefined && this.inputCompany.id !== 0)) {
      if (found !== undefined) {
        if (found.id !== c.id) {
          return true;
        }
      }

      return false;
    }
    return found !== undefined;
  }

  cancelEdit() {
    this.inputCompany = {
      id: 0,
      name: "",
      username: "",
      active: true
    }
  }

  editRow(id: number) {
    const company: Company = this.companyList.find(element => element.id === id)!;
    this.inputCompany.name = company.name;
    this.inputCompany.active = company.active;
    this.inputCompany.username = company.username;
    this.inputCompany.id = company.id;
  }

  resetSearch(): void {
    this.searchValue = "";
    this.translate.get('STANDARD.filter_sorting_removed').subscribe((translatedMessage: string) => {
      this.notificationService.createBasicNotification(2, translatedMessage, '', 'topRight');
    });
    this.loadCompany();
  }

  search(): void {
    this.visible = false;
    this.companyList = this.companyList.filter((item: Company) =>
    (
      item.name!.valueOf().toLocaleLowerCase().toString().includes(this.searchValue.toLocaleLowerCase()) ||
      item.id!.valueOf().toString().includes(this.searchValue.toLocaleLowerCase())
    ));
  }
}
