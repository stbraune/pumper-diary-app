import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { BackgroundMode } from '@ionic-native/background-mode';
import { ChronometerComponent } from '../chronometer';

@Component({
  selector: 'chronometer-control',
  templateUrl: './chronometer-control.component.html'
})
export class ChronometerControlComponent implements OnInit {
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
  
  @Output()
  public chronometerStarted = new EventEmitter<void>();

  @Output()
  public chronometerPaused = new EventEmitter<void>();

  @Output()
  public chronometerRestored = new EventEmitter<void>();

  private paused: boolean = true;
  private pausedMillis: number;

  private resetMillis: number;
  private resetWhilePaused: boolean = true;

  private wasStartedBeforeBackgroundModeActivated = false;

  public shouldShowProgressBar = false;
  public currentProgressInPercent = 0;

  public constructor(
    private backgroundMode: BackgroundMode
  ) { }

  public ngOnInit(): void {
    try {
      this.backgroundMode.on('activate').subscribe(() => {
        this.wasStartedBeforeBackgroundModeActivated = this.started;
        if (this.started) {
          this.pauseChronometer();
        }
      });
      
      this.backgroundMode.on('deactivate').subscribe(() => {
        if (this.wasStartedBeforeBackgroundModeActivated) {
          this.startChronometer();
        }
      });
    } catch (error) {
      console.warn('Cordova not available', error);
    }
  }

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

    this.updateProgressBar(-this.resetMillis);
    this.chronometerRestored.emit();
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
    this.chronometerStarted.emit();
  }

  public resetChronometer(minusMillis: number = 0) {
    this.resetMillis = minusMillis;
    if (this.paused) {
      this.resetWhilePaused = true;
    }

    this.setBase(this.resetMillis);
  }

  public pauseChronometer() {
    this.stopChronometer();
    this.chronometerPaused.emit();
  }

  public stopChronometer() {
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

  public onChronometerTick(millis: number) {
    this.updateProgressBar(millis);
    this.chronometerTicked.emit(this.getSeconds());
  }

  private updateProgressBar(millis: number) {
    this.shouldShowProgressBar = millis <= 0;
    this.currentProgressInPercent = millis > 0 ? 100 : Math.round((this.resetMillis + millis) * 100 / this.resetMillis);
  }

  public onChronometerFinished($event: number) {
    this.chronometerFinished.emit();
  }
}
