import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Step } from '../model';

@Component({
  selector: 'action-step',
  templateUrl: './action-step.component.html'
})
export class ActionStepComponent {
  @Input()
  public step: Step;

  @Output()
  public complete = new EventEmitter<void>();
  
  public emitComplete(): void {
    this.complete.emit();
  }
}
