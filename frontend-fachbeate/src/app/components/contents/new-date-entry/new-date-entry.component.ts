import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TechnologistAppointment } from '../../../models/technologist-appointment';
import { TranslateService } from '@ngx-translate/core';
import { TechDateDTO } from '../../../models/tech-date-dto';
import { log } from '../../../services/logger.service';
import { HttpService } from '../../../services/http.service';
import { NotificationService } from '../../../services/notification.service';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-new-date-entry',
  templateUrl: './new-date-entry.component.html',
  styleUrl: './new-date-entry.component.scss'
})
export class NewDateEntryComponent implements OnInit {
  dateFormat = 'dd.MM.yy'
  addItem: string = "";
  reasonSelect: number = 0;
  reasons: string[] = [
    'holiday',
    'ausgleich',
    'reservation',
    'fair',
    'homeF',
    'houseO'];

  inputDate: TechnologistAppointment = {};
  technologists: TechDateDTO[] = [];

  constructor(private http: HttpService, private notificationService: NotificationService, public roleService: RoleService,
    public translate: TranslateService, // Falls du Übersetzungen verwendest
    public dialogRef: MatDialogRef<NewDateEntryComponent>, // MatDialogRef für Referenzen
    @Inject(MAT_DIALOG_DATA) public data: { timeSpan: TechnologistAppointment, allReasons: string[] } // Daten, die du übergibst
  ) {
  }

  ngOnInit(): void {
   
    this.reasons = this.data.allReasons;
    this.inputDate.startDate = this.data.timeSpan.startDate;

    if (this.data.timeSpan.id !== null && this.data.timeSpan.id !== undefined && this.data.timeSpan.id !== 0) {
      this.inputDate.id = this.data.timeSpan.id;
      this.inputDate.endDate = this.data.timeSpan.endDate;
      this.inputDate.reason = this.data.timeSpan.reason;
      this.inputDate.requestedTechnologist = this.data.timeSpan.requestedTechnologist;
    } else {
      this.inputDate.endDate = this.adjustEndDate(this.data.timeSpan.endDate!.toString())
    }

    this.getTechnologists();
  }

  getFirstLetter(name: string): string {
    return name ? name.charAt(0) : '';
  }

  deleteEntry(entry: TechnologistAppointment) {
    this.http.deleteAppointment(entry).subscribe({
      next: data => {
        this.closeDialog();
      },
      error: err => {
        log("new-date-entry: ", err)
      }
    });
  }

  addToList(addItem: string) {
    this.reasons.push(addItem);
  }

  getTechnologists() {
    this.http.getActiveWithDates().subscribe({
      next: data => {
        this.technologists = data;
      },
      error: err => {
        log("new-date-entry: ", err)
      }
    });
  }

  closeDialog() {
    this.dialogRef.close({});
  }

  save() {
    var requiredFields: string[] = [
      (this.inputDate.requestedTechnologist === null || this.inputDate.requestedTechnologist === undefined) ? "assigned_technologist" : "",
      (this.inputDate.reason === null || this.inputDate.reason === undefined) ? "assigned_reason" : "",
      (this.inputDate.startDate === null || this.inputDate.startDate === undefined) ? "assigned_from" : "",
      (this.inputDate.endDate === null || this.inputDate.endDate === undefined) ? "assigned_to" : "",
    ].filter(element => element !== "");

    if (requiredFields.length !== 0) {
      this.translate.get(['STANDARD.please_fill_required_fields', ...requiredFields.map(element => "STANDARD." + element)]).subscribe(translations => {
        const message = translations['STANDARD.please_fill_required_fields'];
        const anotherMessage = requiredFields.map(element => translations["STANDARD." + element]).toString();
        this.notificationService.createBasicNotification(4, message, anotherMessage, 'topRight');
      });
    }
    else {

      this.inputDate.startDate?.setHours(5);
      this.inputDate.endDate?.setHours(5);

      this.http.postOtherDate(this.inputDate).subscribe({
        next: data => {
          this.translate.get('STANDARD.new_entry_created').subscribe((translatedMessage: string) => {
            this.notificationService.createBasicNotification(0, translatedMessage, 'für ' + this.inputDate.requestedTechnologist!.firstName + " " + this.inputDate.requestedTechnologist!.lastName, 'topRight');
          });

          this.closeDialog();
        },
        error: err => {
          log("new-date-entry: ", err)
        }
      });
    }

  }

  adjustEndDate(endDate: string): Date {
    const date = new Date(endDate);
    date.setDate(date.getDate() - 1);
    return new Date(date.toISOString().split('T')[0]);
  }

  changeTechnolgist($event: any) {
    this.inputDate.requestedTechnologist = this.technologists.find(elemnt => elemnt.technologist.id === $event)!.technologist;
  }

}