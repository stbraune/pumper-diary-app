import { Injectable } from '@angular/core';

import { Vibration } from '@ionic-native/vibration';
import { NativeAudio } from '@ionic-native/native-audio';

@Injectable()
export class BeepService {
  public constructor(
    private vibration: Vibration,
    private audio: NativeAudio
  ) {
    audio.preloadSimple('short', 'assets/sounds/sin_440_300.wav').then((result) => {
      console.info('Successfully loaded short beep sound:', result);
    }).catch((error) => {
      console.warn('Error while loading short beep sound:', error);
    });
    audio.preloadSimple('long', 'assets/sounds/sin_880_1500.wav').then((result) => {
      console.info('Successfully loaded long beep sound:', result);
    }).catch((error) => {
      console.warn('Error while loading long beep sound:', error);
    });
  }
  
  public beepShort() {
    this.audio.play('short');
    this.vibration.vibrate(300);
  }
  
  public beepLong() {
    this.audio.play('long');
    this.vibration.vibrate(1500);
  }
}
