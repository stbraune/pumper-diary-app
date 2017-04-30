import { Component, Input } from '@angular/core';

import { Entry } from '../../../model';

@Component({
  selector: 'entry-action',
  templateUrl: './entry-action.component.html'
})
export class EntryActionComponent {
  @Input()
  public entry: Entry;
}
