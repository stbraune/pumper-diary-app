import { Component, Input } from '@angular/core';

@Component({
  selector: 'set-view',
  templateUrl: './set-view.component.html'
})
export class SetViewComponent {
  @Input()
  public item: any;
}
