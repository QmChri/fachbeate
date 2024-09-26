import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Guest } from '../../../models/guest';
import { NotificationService } from '../../../services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'app-teilnehmer-liste',
  templateUrl: './teilnehmer-liste.component.html',
  styleUrl: './teilnehmer-liste.component.scss'
})
export class TeilnehmerListeComponent implements OnInit {
  i = 1;
  editId: number | null = null;
  listOfData: Guest[] = [];
  currentDate: Date = new Date();
  day = String(this.currentDate.getDate()).padStart(2, '0');
  month = String(this.currentDate.getMonth() + 1).padStart(2, '0'); // Monate sind 0-indexiert
  year = String(this.currentDate.getFullYear()).slice(-2); // Die letzten zwei Ziffern des Jahres
  formattedDate = `${this.day}_${this.month}_${this.year}`;
  currentGuests: Guest[] = [];
  currentId: String;

  constructor(public translate: TranslateService,private http: HttpService,
    public dialogRef: MatDialogRef<TeilnehmerListeComponent>, private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: { guests: Guest[], id: String }
  ) {
    this.currentGuests = data.guests;
    this.currentId = data.id;
    if (data.guests !== null && data.guests !== undefined) {
      data.guests.forEach(element => this.addRow(element));
    }
    if (this.listOfData.length === 0) {
      this.addRow({})
    }
  }

  ngOnInit(): void { }

  startEdit(id: number): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
  }

  addRow(guest: Guest): void {
    this.listOfData = [
      ...this.listOfData,
      {
        id: guest.id,
        editId: this.i,
        sex: guest.sex,
        firstName: guest.firstName,
        lastName: guest.lastName,
        function: guest.function,
      }
    ];
    this.i++;
  }

  deleteRow(id: number): void {
    this.listOfData = this.listOfData.filter(d => d.editId !== id);
  }

  closeDialog(save: boolean) {
    if (save) {
      if (this.listOfData.length === 0||this.listOfData.some(item => (!item.sex || !item.firstName || !item.lastName || !item.function))) {
        this.translate.get(['STANDARD.please_fill_required_fields', 'STANDARD.sex_first_name_last_name']).subscribe(translations => {
          const message = translations['STANDARD.please_fill_required_fields'];
          const anotherMessage = translations['STANDARD.sex_first_name_last_name'];
          this.notificationService.createBasicNotification(4, message, anotherMessage, 'topRight');
        });
      } else {
        
         if(this.listOfData.length !== 0) {
          this.translate.get('STANDARD.participants_added').subscribe((translatedMessage: string) => {
            this.notificationService.createBasicNotification(0, translatedMessage, '', 'topRight');
          });
        }
        this.dialogRef.close(this.listOfData);
      }
    } else {
      this.dialogRef.close(undefined);
    }
  }

  getPdf() {
    this.downloadFile();
    this.translate.get('STANDARD.pdf1').subscribe((translatedMessage: string) => {
      this.notificationService.createBasicNotification(0, translatedMessage, "Teilnehmerliste_"+this.formattedDate+".pdf", 'topRight');
    });
  }
  downloadFile() {
    this.http.getMembersListPdf(this.currentId).subscribe(
      (response: Blob) => {
        this.saveFile(response, "Teilnehmerliste_" + this.formattedDate + ".pdf")
      });
  }

  private saveFile(data: Blob, filename: string): void {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}