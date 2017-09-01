import { Component, Input } from '@angular/core';
import { Measure, Measurement } from '../../../model';

@Component({
  selector: 'repetitions-display',
  templateUrl: './repetitions-display.component.html'
})
export class RepetitionsDisplayComponent {
  @Input()
  public measurement: Measurement;
  
  @Input()
  public short: boolean = false;

  public measureKey(measure: Measure): string {
    return Object.keys(Measure).map((k) => ({ key: k, value: Measure[k] }))
      .find((e) => e.value === measure)
      .key + (this.short ? '.short' : '');
  }
}
