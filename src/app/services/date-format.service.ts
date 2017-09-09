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
    if (now.getTime() > date.getTime()) {
      const diff = this.differenceInDays(this.normalizeDate(date), now);
      if (diff === 0) {
        return this.translateService.get('today');
      } else if (diff === 1) {
        return this.translateService.get('yesterday');
      } else if (diff <= 7) {
        return this.translateService.get('xdaysago', { days: diff });
      }
    }

    return this.formatDateShort(date);
  }

  public formatDateShort(date: Date): Observable<string> {
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

  public formatDuration(start: Date, end: Date): string {
    return this.formatSeconds(((+end) - (+start)) / 1000);
  }

  public formatSeconds(seconds: number): string {
    const h = this.parseInt(seconds / 3600);
    const m = this.parseInt((seconds % 3600) / 60);
    const s = this.parseInt(seconds % 60);

    const hs = h > 9 ? h : '0' + h;
    const ms = m > 9 ? m : '0' + m;
    const ss = s > 9 ? s : '0' + s;

    return hs + ':' + ms + ':' + ss;
  }

  public formatMillis(millis: number): string {
    const abs = Math.abs(millis / 100);
    
    const h = this.parseInt((abs) / 36000);
    const m = this.parseInt((abs % 36000) / 600);
    const s = this.parseInt((abs % 600) / 10);
    const x = this.parseInt(abs % 10);

    const hs = h > 9 ? h : '0' + h;
    const ms = m > 9 ? m : '0' + m;
    const ss = s > 9 ? s : '0' + s;

    if (h > 0) {
      return hs + ':' + ms + ':' + ss + ':' +  x;
    }

    return ms + ':' + ss + ':' +  x;
  }
  
  private parseInt(n: any): number {
    return parseInt(<string>n);
  }
}
