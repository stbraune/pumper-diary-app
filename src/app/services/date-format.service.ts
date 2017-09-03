import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DateFormatService {
  public constructor(
    private translateService: TranslateService
  ) {
  }

  public formatDay(date: Date): Observable<string> {
    const now = new Date();
    const diff = this.differenceInDays(this.normalizeDate(date), now);
    if (diff === 0) {
      return this.translateService.get('today');
    } else if (diff === 1) {
      return this.translateService.get('yesterday');
    } else if (diff <= 7) {
      return this.translateService.get('xdaysago', { days: diff });
    }

    return this.translateService.get('shortDateFormat').map((shortDateFormat) => {
      return new DatePipe(this.translateService.currentLang)
        .transform(date, shortDateFormat);
    });
  }

  private normalizeDate(a: Date) {
    return new Date(a.getFullYear(), a.getMonth(), a.getDate());
  }
  
  private differenceInDays(a: Date, b: Date) {
    return Math.floor(Math.abs(a.getTime() - b.getTime()) / (1000 * 3600 * 24));
  }

  public formatTime(date: Date): Observable<string> {
    return this.translateService.get('shortTimeFormat').map((shortTimeFormat) => {
      return new DatePipe(this.translateService.currentLang)
        .transform(date, shortTimeFormat);
    });
  }
}
