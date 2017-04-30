import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Entry } from '../../../model';

@Component({
  selector: 'entry-action',
  templateUrl: './entry-action.component.html'
})
export class EntryActionComponent {
  @Input()
  public entry: Entry;

  @Output()
  public more = new EventEmitter<Entry>();

  public moreButtonClicked($event: any) {
    $event.entry = this.entry;
    this.more.emit($event);
  }
}
