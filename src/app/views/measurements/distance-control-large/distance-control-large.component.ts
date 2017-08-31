import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  Measure,
  Measurement
} from '../../../model';

import {
  UnitConverterService
} from '../../../services';

@Component({
  selector: 'distance-control-large',
  templateUrl: './distance-control-large.component.html'
})
export class DistanceControlLargeComponent {
  @Input()
  public original: Measurement;

  @Input()
  public actual: Measurement;

  @Output()
  public change = new EventEmitter<Measurement>();
  
  @Output()
  public complete = new EventEmitter<Measurement>();

  public units: { key: string, value: string }[] = [
    { key: UnitConverterService.units.km, value: 'km' },
    { key: UnitConverterService.units.mi, value: 'mi' }
  ];

  public constructor(
    private unitConverterService: UnitConverterService
  ) { }

  public measureKey(measure: Measure): string {
    return Object.keys(Measure).map((k) => ({ key: k, value: Measure[k] }))
      .find((e) => e.value === measure)
      .key;
  }

  public valueChanged(value: number): void {
    this.actual.value = value.toString();
    this.emitChange();
  }

  public unitChanged(unit: string): void {
    this.actual.value = this.unitConverterService.convert(parseFloat(this.actual.value))
      .from(this.actual.unit)
      .to(unit)
      .toFixed(2)
      .replace(/0+$/, '')
      .replace(/\.$/, '');
    this.actual.unit = unit;
    this.emitChange();
  }

  public emitChange() {
    this.change.emit(this.actual);
  }
}
