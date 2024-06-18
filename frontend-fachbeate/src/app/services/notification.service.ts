import { Injectable } from '@angular/core';
import { NzNotificationPlacement, NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private notification: NzNotificationService) { }

  createBasicNotification(notificationStyle: number,text: string, text2: string, position: NzNotificationPlacement): void {
    if (notificationStyle === 0) {
      this.notification.success(
        text, text2,
        { nzPlacement: position }
      );
    }
    else if (notificationStyle === 1) {
      this.notification.warning(
        text, text2,
        { nzPlacement: position }
      );
    }
    else if (notificationStyle === 2) {
      this.notification.info(
        text, text2,
        { nzPlacement: position }
      );
    }
    else {
      this.notification.error(
        text, text2,
        { nzPlacement: position }
      );
    }
  }
}
