import { Component, EventEmitter, Input, Output,
  ViewChild, AfterViewInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

import { ChronometerControlComponent } from '../chronometer-control';

import {
  Measure,
  Measurement
} from '../../../model';

@Component({
  selector: 'duration-control-large',
  templateUrl: './duration-control-large.component.html'
})
export class DurationControlLargeComponent implements OnChanges {
  @Input()
  public original: Measurement;

  @Input()
  public actual: Measurement;

  @Output()
  public change = new EventEmitter<Measurement>();

  @Output()
  public complete = new EventEmitter<Measurement>();

  @Output()
  public restored = new EventEmitter<Measurement>();
  
  @Output()
  public started = new EventEmitter<Measurement>();
  
  @Output()
  public paused = new EventEmitter<Measurement>();

  @ViewChild('chronometer')
  public chronometer: ChronometerControlComponent;

  public ngOnInit(): void {
    this.chronometer.startChronometer();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.original) {
      const matches = /(\d{2})\:(\d{2})\:(\d{2})/.exec(this.original.value);
      this.chronometer.resetChronometer(
        (parseInt(matches[1]) * 3600 + parseInt(matches[2]) * 60 + parseInt(matches[3])) * 1000);
    }
  }

  public measureKey(measure: Measure): string {
    return Object.keys(Measure).map((k) => ({ key: k, value: Measure[k] }))
      .find((e) => e.value === measure)
      .key;
  }

  public onChronometerTicked() {
    const abs = this.chronometer.getSecondsSinceLastReset();
    
    const h = this.parseInt(abs / 3600);
    const m = this.parseInt(abs / 60);
    const s = this.parseInt(abs % 60);

    const hs = h > 9 ? h : '0' + h;
    const ms = m > 9 ? m : '0' + m;
    const ss = s > 9 ? s : '0' + s;

    const str = hs + ':' + ms + ':' + ss;
    if (str !== this.actual.value) {
      this.actual.value = str;
    }
  }
  
  private parseInt(n: any): number {
    return parseInt(<string>n);
  }

  public onChronometerFinished() {
    this.chronometer.stopChronometer();
    this.complete.emit(this.actual);
  }

  public onChronometerRestored() {
    this.restored.emit(this.actual);
  }
  
  public onChronometerPaused() {
    this.paused.emit(this.actual);
  }
  
  public onChronometerStarted() {
    this.started.emit(this.actual);
  }

  public emitChange() {
    this.change.emit(this.actual);
  }
}
