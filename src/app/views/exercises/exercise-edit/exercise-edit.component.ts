import { Component } from '@angular/core';

import {
  NavParams,
  ViewController,
  AlertController
} from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import {
  Exercise,
  Measure
} from '../../../model';

@Component({
  selector: 'exercise-edit',
  templateUrl: './exercise-edit.component.html'
})
export class ExerciseEditComponent {
  public exercise: Exercise;

  public edit = false;

  public measures: { key: string, checked: boolean }[] = [];

  public constructor(
    private navParams: NavParams,
    private viewController: ViewController,
    private alertController: AlertController,
    private translateService: TranslateService
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
    this.edit = !!this.exercise._id;
  }

  public measureToggled(measure: { key: string, checked: boolean}) {
    const measures = this.exercise.measures.filter(x => x !== Measure[measure.key]);
    if (measure.checked) {
      measures.push(Measure[measure.key]);
    }

    this.exercise.measures = measures.sort();
    this.exerciseChanged();
  }

  public exerciseChanged() {
  }

  public dismissExerciseClicked(): void {
    this.viewController.dismiss({
      success: false,
      data: this.exercise
    });
  }

  public deleteExerciseClicked(): void {
    this.translateService.get(['exercise-delete.title', 'exercise-delete.prompt', 'yes', 'no'])
      .subscribe((texts) => {
        const alert = this.alertController.create({
          title: texts['exercise-delete.title'],
          message: texts['exercise-delete.prompt'],
          buttons: [
            {
              text: texts['no'],
              role: 'cancel'
            },
            {
              text: texts['yes'],
              handler: () => {
                this.viewController.dismiss({
                  success: false,
                  delete: true,
                  data: this.exercise
                });
              }
            }
          ]
        });
        alert.present();
      });
  }

  public saveExerciseClicked(): void {
    this.viewController.dismiss({
      success: true,
      data: this.exercise
    });
  }
}
