import { Component, Input } from '@angular/core';
import { Measure, Measurement } from '../../../model';

@Component({
  selector: 'measurement-display',
  templateUrl: './measurement-display.component.html'
})
export class MeasurementDisplayComponent {
  @Input()
  public measurement: Measurement;

  @Input()
  public short: boolean = false;

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
}
