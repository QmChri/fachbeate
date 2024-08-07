import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Guest } from '../../../models/guest';
import { NotificationService } from '../../../services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-teilnehmer-liste',
  templateUrl: './teilnehmer-liste.component.html',
  styleUrl: './teilnehmer-liste.component.scss'
})
export class TeilnehmerListeComponent implements OnInit {
  i = 1;
  editId: number | null = null;
  listOfData: Guest[] = [];

  constructor(public translate: TranslateService,
    public dialogRef: MatDialogRef<TeilnehmerListeComponent>, private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public guests: Guest[]
  ) {
    if (guests !== null && guests !== undefined) {
      guests.forEach(element => this.addRow(element));
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
}