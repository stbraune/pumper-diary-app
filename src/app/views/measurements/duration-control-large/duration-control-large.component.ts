import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  Measure,
  Measurement
} from '../../../model';

@Component({
  selector: 'duration-control-large',
  templateUrl: './duration-control-large.component.html'
})
export class DurationControlLargeComponent {
  @Input()
  public measurement: Measurement;

  @Output()
  public change = new EventEmitter<Measurement>();

  public measureKey(measure: Measure): string {
    return Object.keys(Measure).map((k) => ({ key: k, value: Measure[k] }))
      .find((e) => e.value === measure)
      .key;
  }

  public emitChange() {
    this.change.emit(this.measurement);
  }
}
