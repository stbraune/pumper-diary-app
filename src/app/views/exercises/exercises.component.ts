import { Component } from '@angular/core';
import { ModalController, ToastController, AlertController } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { Exercise } from '../../model';
import { ExercisesService, ToastService } from '../../services';
import { ExerciseEditComponent } from './exercise-edit';

@Component({
  selector: 'exercises',
  templateUrl: './exercises.component.html'
})
export class ExercisesComponent {
  private exercises: Exercise[] = [];

  public constructor(
    private translateService: TranslateService,
    private modalController: ModalController,
    private toastService: ToastService,
    private alertController: AlertController,
    private exercisesService: ExercisesService
  ) {
  }

  public ionViewDidLoad(): void {
    this.loadExercises();
  }

  private loadExercises() {
    this.exercisesService.getExercises().subscribe((exercises) => {
      this.exercises = exercises;
    });
  }

  public exerciseSelected(exercise: Exercise): void {
    let exerciseEditModal = this.modalController.create(ExerciseEditComponent, {
      data: JSON.parse(JSON.stringify(exercise))
    });
    exerciseEditModal.onDidDismiss((result) => {
      if (!result) {
        return;
      }

      if (result.success) {
        this.updateExercise(result.data);
      } else if (result.delete) {
        this.deleteExercise(result.data);
      }
    });
    exerciseEditModal.present();
  }

  public confirmDeleteExercise(exercise: Exercise): void {
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
                this.deleteExercise(exercise);
              }
            }
          ]
        });
        alert.present();
      });
  }

  public addExerciseClicked($event: any): void {
    let newExercise: Exercise = {
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
        this.createExercise(result.data);
      }
    });
    exerciseEditModal.present();
  }

  private createExercise(exercise: Exercise): void {
    this.exercisesService.createExercise(exercise).subscribe((result) => {
      this.exercises.push(result);
      this.toastService.showSuccessToast('save-exercise-succeeded', result);
    }, (error) => {
      this.toastService.showErrorToast('save-exercise-failed', error);
    });
  }

  private updateExercise(exercise: Exercise): void {
    this.exercisesService.updateExercise(exercise).subscribe((result) => {
      const index = this.exercises.findIndex((e) => e._id === exercise._id);
      if (index !== -1) {
        this.exercises.splice(index, 1, result);
      }
      this.toastService.showSuccessToast('save-exercise-succeeded', result);
    }, (error) => {
      this.toastService.showErrorToast('save-exercise-failed', error);
    });
  }

  private deleteExercise(exercise: Exercise): void {
    this.exercisesService.deleteExercise(exercise).subscribe((result) => {
      const index = this.exercises.indexOf(exercise);
      if (index !== -1) {
        this.exercises.splice(index, 1);
      }
      this.toastService.showSuccessToast('delete-exercise-succeeded', result);
    }, (error) => {
      this.toastService.showErrorToast('delete-exercise-failed', error);
    })
  }
}
