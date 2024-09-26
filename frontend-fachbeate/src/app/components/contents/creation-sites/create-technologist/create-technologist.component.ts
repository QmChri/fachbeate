import { Component, HostListener, input, OnInit } from '@angular/core';
import { Technologist } from '../../../../models/technologist';
import { HttpService } from '../../../../services/http.service';
import { NotificationService } from '../../../../services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { log } from '../../../../services/logger.service';

@Component({
  selector: 'app-create-technologist',
  templateUrl: './create-technologist.component.html',
  styleUrl: './create-technologist.component.scss'
})
export class CreateTechnologistComponent implements OnInit {
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
    if (!this.inputTechnologist.firstName || this.inputTechnologist.firstName === "" || !this.inputTechnologist.lastName || this.inputTechnologist.lastName === "") {
      this.translate.get(['STANDARD.please_fill_required_fields', 'STANDARD.first_and_last_name']).subscribe(translations => {
        const message = translations['STANDARD.please_fill_required_fields'];
        const anotherMessage = translations['STANDARD.first_and_last_name'];
        this.notificationService.createBasicNotification(4, message, anotherMessage, 'topRight');
      });
    }
    else {
      this.http.postTechnologist(this.inputTechnologist).subscribe({
        
        next: data => {
          this.translate.get('STANDARD.new_advisor_created').subscribe((translatedMessage: string) => {
            this.notificationService.createBasicNotification(0, translatedMessage, this.inputTechnologist.firstName + ' ' +
              this.inputTechnologist.lastName, 'topRight');
          });

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
