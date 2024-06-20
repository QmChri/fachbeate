import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Guest } from '../../../models/guest';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-teilnehmer-liste',
  templateUrl: './teilnehmer-liste.component.html',
  styleUrl: './teilnehmer-liste.component.scss'
})
export class TeilnehmerListeComponent implements OnInit {
  i = 1;
  editId: number | null = null;
  listOfData: Guest[] = [];

  constructor(
    public dialogRef: MatDialogRef<TeilnehmerListeComponent>, private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public guests: Guest[]
  ) {
    if (guests !== null && guests !== undefined) {
      guests.forEach(element => this.addRow(element));
    }

    if(this.listOfData.length === 0){
      this.addRow({})
    }
  }

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
      if(this.listOfData.some(item => (!item.sex || !item.firstName || !item.lastName || !item.function))){        
        this.notificationService.createBasicNotification(4, 'Pflichtfelder ausfüllen!', '', 'topRight');
      }else{
      if (this.listOfData.length === 0) {
        this.notificationService.createBasicNotification(2, 'Keine Teilnehmer hinzugefügt!', '', 'topRight');
      }
      else {
        this.notificationService.createBasicNotification(0, 'Teilnehmer hinzugefügt!', '', 'topRight');
      }
      this.dialogRef.close(this.listOfData);
      }
      
    } else {
      this.dialogRef.close(undefined);
    }
  }

  ngOnInit(): void {
  }
}