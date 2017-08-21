import { Component } from '@angular/core';
import { ModalController, ToastController } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { Exercise } from '../../model';
import { ExercisesService } from '../../services';
import { ExerciseEditComponent } from './exercise-edit';

@Component({
  selector: 'exercises',
  templateUrl: './exercises.component.html'
})
export class ExercisesComponent { 
  public constructor(
    private translateService: TranslateService,
    private modalController: ModalController,
    private toastController: ToastController,
    private exercisesService: ExercisesService
  ) {
  }

  public getExercises() {
    return this.exercisesService.getExercises();
  }

  public exerciseSelected(exercise: Exercise): void {
    let exerciseEditModal = this.modalController.create(ExerciseEditComponent, {
      data: JSON.parse(JSON.stringify(exercise))
    });
    exerciseEditModal.onDidDismiss((result) => {
      if (result && result.success) {
        this.exercisesService.updateExercise(result.data).subscribe((result) => {
          console.log('exercise saved');
        }, (error) => {
          Observable.forkJoin(
            this.translateService.get('save-exercise-failed'),
            this.translateService.get('close')
          ).subscribe((texts) => {
            this.toastController.create({
              message: texts[0],
              showCloseButton: true,
              closeButtonText: texts[1]
            }).present();
          });
        });
      }
    });
    exerciseEditModal.present();
  }

  public addExerciseClicked($event: any): void {
    let newExercise: Exercise = {
      id: 0,
      title: '',
      description: '',
      difficulty: 1,
      measures: []
    };
    let exerciseEditModal = this.modalController.create(ExerciseEditComponent, {
      data: newExercise
    });
    exerciseEditModal.onDidDismiss((result) => {
      if (result && result.success) {
        this.exercisesService.createExercise(result.data).subscribe((result) => {
          console.log('exercise saved');
        }, (error) => {
          Observable.forkJoin(
            this.translateService.get('save-exercise-failed'),
            this.translateService.get('close')
          ).subscribe((texts) => {
            this.toastController.create({
              message: texts[0],
              showCloseButton: true,
              closeButtonText: texts[1]
            }).present();
          });
        });
      }
    });
    exerciseEditModal.present();
  }
}
