import { Component, Input } from '@angular/core';
import { Measure, Measurement } from '../../../model';

@Component({
  selector: 'distance-display',
  templateUrl: './distance-display.component.html'
})
export class DistanceDisplayComponent {
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
