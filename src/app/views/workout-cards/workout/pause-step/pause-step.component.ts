import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Measure } from '../../../../model';
import { Step } from '../model';

@Component({
  selector: 'pause-step',
  templateUrl: './pause-step.component.html'
})
export class PauseStepComponent {
  @Input()
  public step: Step;
  
  @Output()
  public complete = new EventEmitter<void>();
  
  @Output()
  public restored = new EventEmitter<void>();

  @Output()
  public started = new EventEmitter<void>();

  @Output()
  public paused = new EventEmitter<void>();

  public get pauseDurationInMillis(): number {
    const durationMeasurement = this.step.measurements
      .find((measurement) => measurement.original.measure === Measure.Duration);
    if (durationMeasurement) {
      const matches = /(\d{2})\:(\d{2})\:(\d{2})/.exec(durationMeasurement.original.value);
      return (parseInt(matches[1]) * 3600 + parseInt(matches[2]) * 60 + parseInt(matches[3])) * 1000;
    }
    
    return 0;
  }

  public emitComplete(): void {
    this.complete.emit();
  }

  public emitRestored(): void {
    this.restored.emit();
  }
  
  public emitStarted(): void {
    this.started.emit();
  }

  public emitPaused(): void {
    this.paused.emit();
  }
}
