import { Component, Input } from '@angular/core';

@Component({
  selector: 'action-step',
  templateUrl: './action-step.component.html'
})
export class ActionStep {
  @Input()
  public step: any;
}
