import { Component, OnInit } from '@angular/core';

import { NavParams } from 'ionic-angular';

import {
  Exercise,
  Measure
} from '../../../model';

@Component({
  selector: 'exercise-edit',
  templateUrl: './exercise-edit.component.html'
})
export class ExerciseEditComponent implements OnInit {
  private exercise: Exercise;

  public measures: { key: string, checked: boolean }[] = [];

  public constructor(
    private navParams: NavParams
  ) {
    this.exercise = navParams.get('data');
  }

  public ngOnInit(): void {
    Object.keys(Measure).map(k => Measure[k]).filter(x => typeof x === 'string').forEach((key: string) => {
      this.measures.push({
        key: key,
        checked: this.exercise.measures.find((x) => x === Measure[key]) !== undefined
      });
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
