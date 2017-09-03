import { Component, Input } from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: './progress-bar.component.html'
})
export class ProgressBarComponent {
  @Input()
  public min: number;

  @Input()
  public max: number;

  @Input()
  public value: number;

  @Input()
  public type: string = 'bar';

  @Input()
  public inset: boolean = true;

  public get widthInPercent(): number {
    return Math.round(this.value * 100 / (this.max - this.min));
  }

  public asBar() {
    return !this.asCircle()
      || this.type === 'bar';
  }

  public asCircle() {
    return this.type === 'circle';
  }
}
