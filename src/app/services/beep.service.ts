import { Injectable } from '@angular/core';

import { Vibration } from '@ionic-native/vibration';
import { NativeAudio } from '@ionic-native/native-audio';

@Injectable()
export class BeepService {
  public constructor(
    private vibration: Vibration,
    private audio: NativeAudio
  ) {
    audio.preloadSimple('short', 'assets/sounds/sin_440_300.wav');
    audio.preloadSimple('long', 'assets/sounds/sin_880_1500.wav');
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
