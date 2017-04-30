import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Entry } from '../../../model';

@Component({
  selector: 'entry-pause',
  templateUrl: './entry-pause.component.html'
})
export class EntryPauseComponent {
  @Input()
  public entry: Entry;

  @Output()
  public more = new EventEmitter<Entry>();

  public moreButtonClicked($event: any) {
    $event.entry = this.entry;
    this.more.emit($event);
  }
}
