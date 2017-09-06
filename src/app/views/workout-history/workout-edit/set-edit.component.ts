import { Component, Input } from '@angular/core';
import { Set, Mood } from '../../../model';

@Component({
  selector: 'set-edit',
  templateUrl: './set-edit.component.html'
})
export class SetEditComponent {
  @Input()
  public goalIndex = 0;

  @Input()
  public actionIndex = 0;

  @Input()
  public set: Set;
  
  public isUnhappy(set: Set) {
    return set.mood === Mood.Unhappy;
  }

  public isNeutral(set: Set) {
    return set.mood === Mood.Neutral;
  }

  public isHappy(set: Set) {
    return set.mood === Mood.Happy;
  }

  public moodUnhappyClicked(set: Set) {
    this.setMood(set, Mood.Unhappy);
  }

  public moodNeutralClicked(set: Set) {
    this.setMood(set, Mood.Neutral);
  }

  public moodHappyClicked(set: Set) {
    this.setMood(set, Mood.Happy);
  }

  private setMood(set: Set, mood: Mood) {
    set.mood = set.mood === mood ? undefined : mood;
  }
}
