import { Component, Input } from '@angular/core';

import { Entry } from '../../../model';

@Component({
  selector: 'entry-pause',
  templateUrl: './entry-pause.component.html'
})
export class EntryPauseComponent {
  @Input()
  public entry: Entry;
}
