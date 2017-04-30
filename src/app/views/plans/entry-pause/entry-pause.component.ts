import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  Entry,
  Measure,
  Measurement
} from '../../../model';

@Component({
  selector: 'entry-pause',
  templateUrl: './entry-pause.component.html'
})
export class EntryPauseComponent {
  @Input()
  public entry: Entry;

  public measurement: Measurement;

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
    console.log('changed: ' + JSON.stringify(this.entry));
    this.change.emit(this.entry);
  }
}
