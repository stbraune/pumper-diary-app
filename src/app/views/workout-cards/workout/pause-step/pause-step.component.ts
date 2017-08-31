import { Component, Input } from '@angular/core';

@Component({
  selector: 'pause-step',
  templateUrl: './pause-step.component.html'
})
export class PauseStep {
  @Input()
  public step: any;
}
