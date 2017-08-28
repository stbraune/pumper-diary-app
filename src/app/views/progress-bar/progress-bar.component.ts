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

  public get widthInPercent(): string {
    return Math.round(this.value * 10000 / (this.max - this.min) / 100) + '%';
  }
}
