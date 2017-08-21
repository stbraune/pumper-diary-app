import { Component } from '@angular/core';

import {
  NavParams,
  ViewController
} from 'ionic-angular';

import {
  Exercise,
  Measure
} from '../../../model';

@Component({
  selector: 'exercise-edit',
  templateUrl: './exercise-edit.component.html'
})
export class ExerciseEditComponent {
  private exercise: Exercise;

  public measures: { key: string, checked: boolean }[] = [];

  public constructor(
    private navParams: NavParams,
    private viewController: ViewController
  ) {
    this.exercise = this.navParams.get('data');
  }

  public ionViewDidLoad(): void {
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

  public dismissExerciseClicked(): void {
    this.viewController.dismiss({
      success: false,
      data: this.exercise
    });
  }

  public saveExerciseClicked(): void {
    this.viewController.dismiss({
      success: true,
      data: this.exercise
    });
  }
}
