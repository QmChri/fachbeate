import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { Representative } from '../../../../models/representative';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from '../../../../services/http.service';
import { NotificationService } from '../../../../services/notification.service';
import { log } from '../../../../services/logger.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NzCustomColumn } from 'ng-zorro-antd/table';
import { forkJoin } from 'rxjs';
import { Technologist } from '../../../../models/technologist';

@Component({
  selector: 'app-sub-groups',
  templateUrl: './sub-groups.component.html',
  styleUrl: './sub-groups.component.scss'
})
export class SubGroupsComponent implements OnInit {
  selectedWorker: Representative = {};
  representativeList: Representative[] = [];
  technologistList: Technologist[] = [];
  dadRight: CustomColumn[] = [];
  dadLeft: CustomColumn[] = [];
  public pageSize: number = 9;

  constructor(public translate: TranslateService, private http: HttpService,
    private notificationService: NotificationService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadAll();
    this.calculatePageSize();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calculatePageSize();
  }
  calculatePageSize(): void {
    const tableHeight = window.innerHeight - 254; //Puffer für Header/Footer
    console.log(tableHeight)
    const rowHeight = 54; // Höhe einer Tabellenzeile
    this.pageSize = Math.floor(tableHeight / rowHeight);
  }

  loadAll() {
    forkJoin({
      representatives: this.http.getAllRepresentative(),
      technologists: this.http.getAllTechnologist()
    }).subscribe({
      next: ({ representatives, technologists }) => {
        this.representativeList = [...representatives];
        this.technologistList = [...technologists];
      },
      error: err => {
        log("create-representative: ", err);
      }
    });

  }

  loadDadLeft() {
    this.dadLeft = [];

    let tmp: { id: string, firstName: string, lastName: string }[] = [
      ...this.representativeList.map(element => ({ id: "R_" + element.id!, firstName: element.firstName!, lastName: element.lastName! })),
      ...this.technologistList.map(element => ({ id: "T_" + element.id!, firstName: element.firstName!, lastName: element.lastName! })),]

    tmp.filter(rep => (rep.id.split("_")[1] !== this.selectedWorker.id?.toString() || rep.id.split("_")[0] !== "R")).forEach(rep => {
      this.dadLeft.push({
        name: `${rep.firstName} ${rep.lastName}`,
        value: `${rep.firstName!.toLowerCase()}.${rep.lastName!.toLowerCase()}`,
        id: rep.id!,
        default: false,
        required: false,
        position: 'right',
        width: 150,
        fixWidth: false
      });
    });
  }

  getNotification(type: number) {
    switch (type) {
      case 1: { //Gruppe wurde erstellte
        this.translate.get('CREATION_SITES.created_group').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(0, translatedMessage, '', 'topRight');
        });
        break;
      }
      case 2: { //Gruppe konnte nicht erstellt werden
        this.translate.get('CREATION_SITES.created_error').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(1, translatedMessage, '', 'topRight');
        });
        break;
      }
    }
  }

  drop(event: CdkDragDrop<CustomColumn[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    this.dadRight = this.dadRight.map(item => {
      item.default = true;
      return item;
    });
    this.dadLeft = this.dadLeft.map(item => {
      item.default = false;
      return item;
    });
    this.cdr.markForCheck();
  }

  setRepresentative(workerId: number) {
    this.dadRight = [];
    this.dadLeft = [];

    this.selectedWorker = this.representativeList.find(s => s.id === workerId)!;
    let tmp: { id: string, firstName: string, lastName: string }[] = [
      ...(this.selectedWorker.groupMembersRepresentatives?.map(element => ({
        id: "R_" + element.id!,
        firstName: element.firstName!,
        lastName: element.lastName!
      })) ?? []),
      ...(this.selectedWorker.groupMembersTechnologist?.map(element => ({
        id: "T_" + element.id!,
        firstName: element.firstName!,
        lastName: element.lastName!
      })) ?? []),
    ];

    tmp.filter(rep => (rep.id.split("_")[1] !== this.selectedWorker.id?.toString() || rep.id.split("_")[0] !== "R")).forEach(rep => {
      this.dadRight.push({
        name: `${rep.firstName} ${rep.lastName}`,
        value: `${rep.firstName!.toLowerCase()}.${rep.lastName!.toLowerCase()}`,
        id: rep.id!,
        default: false,
        required: false,
        position: 'right',
        width: 150,
        fixWidth: false
      });
    });

    this.loadDadLeft();
    this.dadLeft = this.dadLeft.filter(element => !this.dadRight.some(right => right.id === element.id));
  }

  postGroup() {
    this.selectedWorker.groupMembersRepresentatives = this.representativeList
      .filter(rep => this.dadRight.some(element => element.id.split("_")[0] === "R" && element.id.split("_")[1] === rep.id!.toString()));

    this.selectedWorker.groupMembersTechnologist = this.technologistList
      .filter(rep => this.dadRight.some(element => element.id.split("_")[0] === "T" && element.id.split("_")[1] === rep.id!.toString()));

    console.log(this.selectedWorker)
    this.http.postGroup(this.selectedWorker).subscribe({
      next: data => {
        this.selectedWorker = data;
        this.getNotification(1);
      },
      error: err => {
        console.error("create-group: ", err);
        this.getNotification(2);
      }
    });
  }
}

interface CustomColumn extends NzCustomColumn {
  name: string;
  id: string;
  required?: boolean;
  position?: 'left' | 'right';
}