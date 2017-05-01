import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  Measure,
  Measurement
} from '../../../model';

import {
  UnitConverterService
} from '../../../services';

@Component({
  selector: 'weight-control-small',
  templateUrl: './weight-control-small.component.html'
})
export class WeightControlSmallComponent {
  @Input()
  public measurement: Measurement;

  @Output()
  public change = new EventEmitter<Measurement>();

  public units: { key: string, value: string }[] = [
    { key: UnitConverterService.units.kg, value: 'kg' },
    { key: UnitConverterService.units.lb, value: 'lb' }
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
    this.measurement.value = value.toString();
    this.emitChange();
  }

  public unitChanged(unit: string): void {
    this.measurement.value = this.unitConverterService.convert(parseFloat(this.measurement.value))
      .from(this.measurement.unit)
      .to(unit)
      .toFixed(2)
      .replace(/0+$/, '')
      .replace(/\.$/, '');
    this.measurement.unit = unit;
    this.emitChange();
  }

  public emitChange() {
    this.change.emit(this.measurement);
  }
}
