import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  Entry,
  Measurement
} from '../../../model';

@Component({
  selector: 'entry-action',
  templateUrl: './entry-action.component.html'
})
export class EntryActionComponent {
  @Input()
  public entry: Entry;

  @Output()
  public more = new EventEmitter<Entry>();

  @Output()
  public change = new EventEmitter<Entry>();

  public moreButtonClicked($event: any) {
    $event.entry = this.entry;
    this.more.emit($event);
  }

  public measurementChanged(measurement: Measurement) {
    this.emitChange();
  }

  public emitChange() {
    this.change.emit(this.entry);
  }
}
