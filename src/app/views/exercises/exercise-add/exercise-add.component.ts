import { Component, OnInit } from '@angular/core';

import { Exercise } from '../../../model/exercise';
import { Measure } from '../../../model/measure';

@Component({
  selector: 'exercise-add',
  templateUrl: './exercise-add.component.html'
})
export class ExerciseAddComponent implements OnInit {
  private exercise: Exercise;

  public measures: { key: string, checked: boolean }[] = [];

  public constructor(
  ) {
    this.exercise = {
      id: 0,
      title: '',
      description: '',
      difficulty: 0,
      measures: []
    };
  }

  public ngOnInit(): void {
    Object.keys(Measure).map(k => Measure[k]).filter(x => typeof x === 'string').forEach((key: string) => {
      this.measures.push({ key: key, checked: false });
    });
  }

  public measureToggled(measure: { key: string, checked: boolean}) {
    let measures = this.exercise.measures.filter(x => x !== Measure[measure.key]);
    if (measure.checked) {
      measures.push(Measure[measure.key]);
    }

    this.exercise.measures = measures.sort();
    this.exerciseChanged();
  }

  public exerciseChanged() {
    console.log(JSON.stringify(this.exercise));
  }
}
