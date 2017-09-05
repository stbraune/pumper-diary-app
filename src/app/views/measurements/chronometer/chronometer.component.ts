import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { BeepService } from '../../../services';

@Component({
  selector: 'chronometer',
  templateUrl: './chronometer.component.html'
})
export class ChronometerComponent implements OnInit, OnDestroy {
  private _base = new Date();

  @Input()
  public set base(value: Date) {
    this._base = value;
    if (!this._started) {
      this.tick(false);
    }
  }

  public get base() {
    return this._base;
  }

  @Input()
  public loud = true;

  @Input()
  public resolution = 100;

  @Output()
  public chronometerTicked = new EventEmitter<number>();

  @Output()
  public chronometerFinished = new EventEmitter<number>();

  private _started: boolean;
  private _interval;

  public state = 0;
  public value = 'XX:XX:XX';
  public color = 'chronometer--neutral';

  public constructor(
    private beepService: BeepService
  ) {
  }

  public ngOnInit(): void {
    this.tick(false);
  }

  public ngOnDestroy(): void {
    this.stop();
  }
  
  public get started(): boolean {
    return this._started;
  }

  public start(): void {
    if (!this._started) {
      this._started = true;
      this.start1();
    }
  }
  
  public stop(): void {
    this._started = false;
    this.stop1();
  }

  private start1() {
    const requestAnimationFrame = window['requestAnimationFrame'] ||
      window['webkitRequestAnimationFrame'] ||
      window['mozRequestAnimationFrame'] ||
      window['msRequestAnimationFrame'] ||
      window['oRequestAnimationFrame'];
    if (requestAnimationFrame) {
      const last = new Date().getTime();
      const self = this;
      const interval = function() {
        if (self._started) {
          requestAnimationFrame(interval);
        }

        const now = new Date().getTime();
        if (now - last >= self.resolution) {
          self.tick(self.loud);
        }
      };
      requestAnimationFrame(interval);
    } else {
      this._interval = setInterval(() => {
        this.tick(this.loud);
      }, this.resolution);
    }
  }

  private stop1() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = undefined;
    }
  }
  
  private tick(loud: boolean) {
    const millis = this.millis;
    if (loud) {
      this.emitChronometerTicked(millis);
      this.state = this.beep(millis, this.state);
    }

    this.value = this.formatDuration(millis);
    this.color = this.formatColor(millis);
  }

  public get millis() {
    const now = new Date();
    return now.getTime() - this.base.getTime();
  }
  
  private beep(millis: number, state: number) {
    if (0 <= millis && millis < 1000 && state === 1) {
      this.beepLong();
      this.emitChronometerFinished(millis);
      return 0;
    } else if (-1000 <= millis && millis < 0 && state === 2) {
      this.beepShort();
      return 1;
    } else if (-2000 <= millis && millis < -1000 && state === 3) {
      this.beepShort();
      return 2;
    } else if (-3000 <= millis && millis < -2000 && state === 0) {
      this.beepShort();
      return 3;
    }

    return state;
  }

  private beepShort() {
    console.log('beep short', this.millis);
    this.beepService.beepShort();
  }
  
  private beepLong() {
    console.log('beep long', this.millis);
    this.beepService.beepLong();
  }
  
  private formatDuration(millis: number) {
    const abs = Math.abs(millis / 100);

    const h = this.parseInt((abs) / 36000);
    const m = this.parseInt((abs % 36000) / 600);
    const s = this.parseInt((abs % 600) / 10);
    const x = this.parseInt(abs % 10);

    if (h > 0) {
      const hs = h > 9 ? h : '0' + h;
      const ms = m > 9 ? m : '0' + m;
      const ss = s > 9 ? s : '0' + s;
      const xs = x;
      return hs + ':' + ms + ':' + ss + ':' +  xs;
    } else {
      const ms = m > 9 ? m : '0' + m;
      const ss = s > 9 ? s : '0' + s;
      const xs = x;
      return ms + ':' + ss + ':' +  xs;
    }
  }

  private formatColor(millis: number) {
    const centiseconds = this.parseInt(millis / 100);
    if (centiseconds < 0) return 'chronometer--negative';
    if (centiseconds > 0) return 'chronometer--positive';
    return 'chronometer--neutral';
  }
  
  private parseInt(n: any): number {
    return parseInt(<string>n);
  }

  private emitChronometerTicked(millis: number) {
    this.chronometerTicked.emit(millis);
  }

  private emitChronometerFinished(millis: number) {
    this.chronometerFinished.emit(millis);
  }
}
