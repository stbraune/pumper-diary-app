import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ToastService {
  public constructor(
    private toastController: ToastController,
    private translateService: TranslateService
  ) {
  }

  public showSuccessToast(messageKey: string, data?: any) {
    this.translateService.get([messageKey]).subscribe((texts) => {
      console.info(texts[messageKey], data);
      this.toastController.create({
        message: texts[messageKey],
        duration: 2000
      }).present();
    });
  }

  public showErrorToast(messageKey: string, error?: any, duration?: number) {
    this.translateService.get([messageKey, 'close']).subscribe((texts) => {
      if (error) {
        console.error(texts[messageKey], error);
      }

      this.toastController.create({
        message: texts[messageKey],
        closeButtonText: texts['close'],
        duration,
        showCloseButton: true
      }).present();
    });
  }
}
