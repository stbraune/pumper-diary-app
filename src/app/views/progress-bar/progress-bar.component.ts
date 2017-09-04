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
  public height: string;

  @Input()
  public inset: boolean = true;

  public get widthInPercent(): number {
    const div = this.max - this.min;
    if (div === 0) {
      return 100;
    }

    return Math.round(this.value * 100 / div);
  }

  public asBar() {
    return !this.asCircle()
      || this.type === 'bar';
  }

  public asCircle() {
    return this.type === 'circle';
  }
}
