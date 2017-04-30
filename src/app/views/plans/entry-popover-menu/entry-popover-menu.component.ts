import { Component } from '@angular/core';

import { NavParams, ViewController } from 'ionic-angular';

import { Entry } from '../../../model';

@Component({
  selector: 'entry-popover-menu',
  templateUrl: './entry-popover-menu.component.html'
})
export class EntryPopoverMenuComponent {
  private entry: Entry;
  private deleteClicked: (entry: Entry) => void;

  public constructor(
    private navParams: NavParams,
    private viewController: ViewController
  ) {
    this.entry = this.navParams.get('entry');
    this.deleteClicked = this.navParams.get('deleteClicked');
  }

  public deleteEntryClicked() {
    this.deleteClicked(this.entry);
    this.closePopover();
  }

  public closePopover(): void {
    this.viewController.dismiss();
  }
}