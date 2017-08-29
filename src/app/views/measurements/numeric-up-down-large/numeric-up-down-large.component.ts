import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'numeric-up-down-large',
  templateUrl: './numeric-up-down-large.component.html'
})
export class NumericUpDownLargeComponent {
  @Input()
  public label: string = '';

  @Input()
  public value: string = '0';

  @Input()
  public unit: string = '';

  @Input()
  public step: number = 2.5;

  @Input()
  public min: number = -Infinity;

  @Input()
  public max: number = Infinity;

  @Input()
  public units: { key: string, value: string }[] = [];

  @Output()
  public valueChange = new EventEmitter<number>();

  @Output()
  public unitChange = new EventEmitter<string>();

  public incrementValue(): void {
    this.value = this.fixedValue(this.numericValue() + this.step).toString();
    this.emitValueChange();
  }

  public decrementValue(): void {
    this.value = this.fixedValue(this.numericValue() - this.step).toString();
    this.emitValueChange();
  }

  public valueChanged(): void {
    this.emitValueChange();
  }

  public unitChanged(): void {
    this.emitUnitChange();
  }

  private fixedValue(val: number): number {
    return Math.max(Math.min(val, this.max), this.min);
  }

  public numericValue(): number {
    let val = parseFloat(this.value);
    return val ? val : 0;
  }

  public emitValueChange() {
    this.valueChange.emit(this.numericValue());
  }

  public emitUnitChange() {
    this.unitChange.emit(this.unit);
  }
}
