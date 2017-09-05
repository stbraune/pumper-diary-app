import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: './progress-bar.component.html'
})
export class ProgressBarComponent implements OnChanges {
  @Input()
  public min: number;

  @Input()
  public max: number;

  @Input()
  public value: number;

  @Input()
  public type: string = 'bar';

  @Input()
  public height: string;

  @Input()
  public inset: boolean = true;

  public widthInPercent = 0;

  public ngOnChanges(simpleChanges: SimpleChanges): void {
    if (simpleChanges.min || simpleChanges.max || simpleChanges.value) {
      const div = this.max - this.min;
      this.widthInPercent = div === 0 ? 100 : Math.round(this.value * 100 / div);
    }
  }

  public asBar() {
    return !this.asCircle()
      || this.type === 'bar';
  }

  public asCircle() {
    return this.type === 'circle';
  }
}
