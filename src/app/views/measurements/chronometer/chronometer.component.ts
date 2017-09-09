import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, NgZone } from '@angular/core';
import { BeepService, DateFormatService } from '../../../services';

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

    this.state = 0;
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
    private beepService: BeepService,
    private dateFormatService: DateFormatService,
    private ngZone: NgZone
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
      
      if (NgZone.isInAngularZone()) {
        this.start1();
      } else {
        this.ngZone.run(() => {
          this.start1();
        })
      }
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
      let last = undefined;
      const self = this;
      const interval = function(now) {
        if (!last) last = now;

        if (self._started) {
          requestAnimationFrame(interval);

          const delta = now - last;
          if (delta > self.resolution) {
            self.tick(self.loud);
            last = now;
          }
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
    this.beepService.beepShort();
  }
  
  private beepLong() {
    this.beepService.beepLong();
  }
  
  private formatDuration(millis: number) {
    return this.dateFormatService.formatMillis(millis);
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
