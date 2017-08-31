import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  Measure,
  Measurement
} from '../../../model';

@Component({
  selector: 'calories-control-large',
  templateUrl: './calories-control-large.component.html'
})
export class CaloriesControlLargeComponent {
  @Input()
  public original: Measurement;

  @Input()
  public actual: Measurement;

  @Output()
  public change = new EventEmitter<Measurement>();
  
  @Output()
  public complete = new EventEmitter<Measurement>();

  public measureKey(measure: Measure): string {
    return Object.keys(Measure).map((k) => ({ key: k, value: Measure[k] }))
      .find((e) => e.value === measure)
      .key;
  }

  public valueChanged(value: number): void {
    this.actual.value = value.toString();
    this.emitChange();
  }

  public emitChange() {
    this.change.emit(this.actual);
  }
}
