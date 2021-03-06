import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  Measure,
  Measurement
} from '../../../model';

@Component({
  selector: 'measurement-control-small',
  templateUrl: './measurement-control-small.component.html'
})
export class MeasurementControlSmallComponent {
  @Input()
  public measurement: Measurement;

  @Output()
  public change = new EventEmitter<Measurement>();

  public isCalories() {
    return this.measurement.measure === Measure.Calories;
  }

  public isDistance() {
    return this.measurement.measure === Measure.Distance;
  }

  public isDuration() {
    return this.measurement.measure === Measure.Duration;
  }

  public isRepetitions() {
    return this.measurement.measure === Measure.Repetitions;
  }

  public isWeight() {
    return this.measurement.measure === Measure.Weight;
  }

  public emitChange() {
    this.change.emit(this.measurement);
  }
}
