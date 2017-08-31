import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ChronometerComponent } from '../chronometer';


@Component({
  selector: 'chronometer-control',
  templateUrl: './chronometer-control.component.html'
})
export class ChronometerControlComponent {
  @ViewChild('chronometer')
  public chronometer: ChronometerComponent;

  @Input()
  public label: string;

  @Input()
  public started: boolean;
  
  @Output()
  public chronometerTicked = new EventEmitter<number>();

  @Output()
  public chronometerFinished = new EventEmitter<void>();

  private paused: boolean = true;
  private pausedMillis: number;

  private resetMillis: number;
  private resetWhilePaused: boolean = true;

  public toggleChronometer() {
    if (this.started) {
      this.pauseChronometer();
    } else {
      this.startChronometer();
    }
  }

  public restoreChronometer() {
    let wasRunning = false;
    if (this.started) {
      this.pauseChronometer();
      this.paused = false;
      wasRunning = true;
    }

    this.resetChronometer(this.resetMillis);
    if (wasRunning) {
      this.startChronometer();
    }
  }

  public startChronometer() {
    if (this.started) {
      return;
    }

    this.started = true;
    if (this.paused) {
      if (this.resetWhilePaused) {
        this.setBase(this.resetMillis);
        this.resetWhilePaused = false;
      } else {
        this.setBase(-this.pausedMillis);
      }
      this.paused = false;
    }

    this.chronometer.start();
  }

  public resetChronometer(minusMillis: number = 0) {
    this.resetMillis = minusMillis;
    if (this.paused) {
      this.resetWhilePaused = true;
    }

    this.setBase(this.resetMillis);
  }

  public pauseChronometer() {
    if (!this.started) {
      return;
    }

    this.pausedMillis = this.chronometer.millis;
    this.paused = true;
    this.started = false;
    this.chronometer.stop();
  }

  private setBase(minusMillis: number) {
    const d = new Date();
    d.setTime(d.getTime() + minusMillis);
    this.chronometer.base = d;
  }

  public getSeconds(): number {
    return Math.round((new Date().getTime() - this.chronometer.base.getTime()) / 1000);
  }
  
  public getSecondsSinceLastReset(): number {
    return Math.round((new Date().getTime() - this.chronometer.base.getTime() + this.resetMillis) / 1000);
  }

  public onChronometerTick($event: number) {
    this.chronometerTicked.emit(this.getSeconds());
  }

  public onChronometerFinished($event: number) {
    this.chronometerFinished.emit();
  }
}
