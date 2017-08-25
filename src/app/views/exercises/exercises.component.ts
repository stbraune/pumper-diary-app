import { Component, ChangeDetectorRef } from '@angular/core';
import { ModalController, ToastController, AlertController } from 'ionic-angular';
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
    private alertController: AlertController,
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

  private updateExercise(exercise: Exercise): void {
    this.exercisesService.updateExercise(exercise).subscribe((result) => {
      this.showSuccessToast('save-exercise-succeeded');
    }, (error) => {
      this.showErrorToast('save-exercise-failed');
    });
  }

  private deleteExercise(exercise: Exercise): void {
    this.exercisesService.deleteExercise(exercise).subscribe((result) => {
      this.showSuccessToast('delete-exercise-succeeded');
    }, (error) => {
      this.showErrorToast('delete-exercise-failed');
    })
  }

  private showSuccessToast(messageKey: string) {
    this.translateService.get([messageKey]).subscribe((texts) => {
      this.toastController.create({
        message: texts[messageKey],
        duration: 2000
      }).present();
    });
  }

  private showErrorToast(messageKey: string) {
    this.translateService.get([messageKey, 'close']).subscribe((texts) => {
      this.toastController.create({
        message: texts[messageKey],
        closeButtonText: texts['close'],
        showCloseButton: true
      }).present();
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
