import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Step } from '../model';

import { Set, Mood } from '../../../../model';

@Component({
  selector: 'action-step',
  templateUrl: './action-step.component.html'
})
export class ActionStepComponent {
  @Input()
  public step: Step;

  @Output()
  public complete = new EventEmitter<void>();
  
  public emitComplete(): void {
    this.complete.emit();
  }

  public isUnhappy() {
    return this.step.set.mood === Mood.Unhappy;
  }

  public isNeutral() {
    return this.step.set.mood === Mood.Neutral;
  }

  public isHappy() {
    return this.step.set.mood === Mood.Happy;
  }
  
  public moodUnhappyClicked() {
    this.setMood(this.step.set, Mood.Unhappy);
  }

  public moodNeutralClicked() {
    this.setMood(this.step.set, Mood.Neutral);
  }

  public moodHappyClicked() {
    this.setMood(this.step.set, Mood.Happy);
  }

  private setMood(set: Set, mood: Mood) {
    set.mood = set.mood === mood ? undefined : mood;
  }
}
