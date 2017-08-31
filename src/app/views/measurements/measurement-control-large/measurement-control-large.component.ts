import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  Measure,
  Measurement
} from '../../../model';

@Component({
  selector: 'measurement-control-large',
  templateUrl: './measurement-control-large.component.html'
})
export class MeasurementControlLargeComponent {
  @Input()
  public original: Measurement;

  @Input()
  public actual: Measurement;

  @Output()
  public change = new EventEmitter<Measurement>();
  
  @Output()
  public complete = new EventEmitter<Measurement>();

  public isCalories() {
    return this.original.measure === Measure.Calories;
  }

  public isDistance() {
    return this.original.measure === Measure.Distance;
  }

  public isDuration() {
    return this.original.measure === Measure.Duration;
  }

  public isRepetitions() {
    return this.original.measure === Measure.Repetitions;
  }

  public isWeight() {
    return this.original.measure === Measure.Weight;
  }

  public emitChange() {
    this.change.emit(this.actual);
  }

  public emitComplete() {
    this.complete.emit(this.actual);
  }
}
