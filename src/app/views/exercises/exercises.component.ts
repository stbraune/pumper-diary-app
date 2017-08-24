import { Component, ChangeDetectorRef } from '@angular/core';
import { ModalController, ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

import { TranslateService } from '@ngx-translate/core';

import { Exercise } from '../../model';
import { ExercisesService } from '../../services';
import { ExerciseEditComponent } from './exercise-edit';

@Component({
  selector: 'exercises',
  templateUrl: './exercises.component.html'
})
export class ExercisesComponent {
  private exercisesChangedSubscription: Subscription;

  public constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private modalController: ModalController,
    private toastController: ToastController,
    private exercisesService: ExercisesService
  ) {
  }

  public ionViewDidLoad(): void {
    this.exercisesChangedSubscription = this.exercisesService.exercisesChanged.subscribe((change) => {
      this.changeDetectorRef.detectChanges();
    });
  }

  public ionViewWillUnload(): void {
    this.exercisesChangedSubscription.unsubscribe();
  }

  public getExercises() {
    return this.exercisesService.getExercises();
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
        this.exercisesService.updateExercise(result.data).subscribe((result) => {
          console.log('exercise saved');
        }, (error) => {
          this.translateService.get(['save-exercise-failed', 'close']).subscribe((texts) => {
            this.toastController.create({
              message: texts['save-exercise-failed'],
              closeButtonText: texts['close'],
              showCloseButton: true
            }).present();
          });
        });
      } else if (result.delete) {
        this.exercisesService.deleteExercise(result.data).subscribe((result) => {
          console.log('exercise deleted', result);
        }, (error) => {
          this.translateService.get(['delete-exercise-failed', 'close']).subscribe((texts) => {
            this.toastController.create({
              message: texts['delete-exercise-failed'],
              closeButtonText: texts['close'],
              showCloseButton: true
            }).present();
          });
        })
      }
    });
    exerciseEditModal.present();
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
        this.exercisesService.createExercise(result.data).subscribe((result) => {
          console.log('exercise saved');
        }, (error) => {
          this.translateService.get(['save-exercise-failed', 'close']).subscribe((texts) => {
            this.toastController.create({
              message: texts['save-exercise-failed'],
              showCloseButton: true,
              closeButtonText: texts['closed']
            }).present();
          });
        });
      }
    });
    exerciseEditModal.present();
  }
}
