import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { NativeAudio } from '@ionic-native/native-audio';

@Injectable()
export class BeepService {
  private audioType: string = 'html5';
  private sounds: any = [];

  public constructor(
    private platform: Platform,
    private vibration: Vibration,
    private nativeAudio: NativeAudio
  ) {
    if (platform.is('cordova')) {
      this.audioType = 'native';
    }

    this.preload('short', 'assets/sounds/sin_440_300.wav');
    this.preload('long', 'assets/sounds/sin_880_1500.wav');
  }

  public beepShort() {
    this.play('short');
    this.vibration.vibrate(300);
  }

  public beepLong() {
    this.play('long');
    this.vibration.vibrate(1500);
  }

  public preload(key: string, asset: string) {
    if (this.audioType === 'html5') {
      this.sounds.push({
        key: key,
        asset: asset,
        type: 'html5'
      });
    } else {
      this.nativeAudio.preloadSimple(key, asset).then((result) => {
        console.info('Successfully loaded sound:', key, asset, result);
      }).catch((error) => {
        console.warn('Error while loading sound:', key, asset, error);
      });
      this.sounds.push({
        key: key,
        asset: key,
        type: 'native'
      });
    }
  }

  public play(key: string) {
    let audio = this.sounds.find((sound) => sound.key === key);
    if (audio.type === 'html5') {
      let audioAsset = new Audio(audio.asset);
      audioAsset.play();
    } else {
      this.nativeAudio.play(audio.asset).then((res) => {
        console.log(res);
      }, (err) => {
        console.warn(err);
      });
    }
  }
}
