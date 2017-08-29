import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  Measure,
  Measurement
} from '../../../model';

@Component({
  selector: 'repetitions-control-large',
  templateUrl: './repetitions-control-large.component.html'
})
export class RepetitionsControlLargeComponent {
  @Input()
  public measurement: Measurement;

  @Output()
  public change = new EventEmitter<Measurement>();

  public measureKey(measure: Measure): string {
    return Object.keys(Measure).map((k) => ({ key: k, value: Measure[k] }))
      .find((e) => e.value === measure)
      .key;
  }

  public valueChanged(value: number): void {
    this.measurement.value = value.toString();
    this.emitChange();
  }

  public emitChange() {
    this.change.emit(this.measurement);
  }
}
