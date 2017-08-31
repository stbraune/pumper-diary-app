import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Step } from '../model';

@Component({
  selector: 'pause-step',
  templateUrl: './pause-step.component.html'
})
export class PauseStepComponent {
  @Input()
  public step: Step;
  
  @Output()
  public complete = new EventEmitter<void>();

  public emitComplete(): void {
    this.complete.emit();
  }
}
