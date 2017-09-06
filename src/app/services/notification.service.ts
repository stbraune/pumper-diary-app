import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { LocalNotifications, ILocalNotification } from '@ionic-native/local-notifications';
import { COLORS } from '../../theme/variables';

@Injectable()
export class NotificationService {
  public static readonly NotificationIds = {
    pauseFinished: 1
  };

  public constructor(
    private localNotifications: LocalNotifications,
    private translateService: TranslateService
  ) {
  }

  public notifyPauseFinished(afterMillis: number) {
    console.log('adding notification');
    const now = new Date();
    this.translateService.get(['notifications.pause-finished.title', 'notifications.pause-finished.text'])
      .subscribe((texts) => {
        this.localNotifications.schedule({
          id: NotificationService.NotificationIds.pauseFinished,
          title: texts['notifications.pause-finished.title'],
          text: texts['notifications.pause-finished.text'],
          led: COLORS.primary,
          at: new Date(now.getTime() + afterMillis)
        });
      });
  }
  
  public clearPauseFinished() {
    console.log('clearing notification');
    // this.localNotifications.getTriggeredIds().then((ids) => {
    //   console.log('currently triggered notifications: ', ids);
    // });
    this.localNotifications.clear(NotificationService.NotificationIds.pauseFinished);
    // .then((x) => {
    //   console.log('cleared pause');
    // }).catch((error) => {
    //   console.log('failed clearing pause');
    // });
  }
}
