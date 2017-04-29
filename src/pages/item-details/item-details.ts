import { Component } from '@angular/core';

import { Vibration } from '@ionic-native/vibration';
import { NativeAudio } from '@ionic-native/native-audio';

import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html'
})
export class ItemDetailsPage {
  selectedItem: any;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private vibration: Vibration,
    private nativeAudio: NativeAudio

  ) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.nativeAudio.preloadSimple('bass', 'assets/sounds/bass.mp3');
  }

  playBeep(): void {
    this.nativeAudio.play('bass');
  }
}
