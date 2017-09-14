import { Component } from '@angular/core';
import { ModalController, ToastController, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { Exercise, EntryType } from '../../model';
import { ExercisesService, PlansService, ToastService, MeasurementsService } from '../../services';
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
    private exercisesService: ExercisesService,
    private plansService: PlansService,
    private measurementsService: MeasurementsService
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
    const copy = JSON.parse(JSON.stringify(exercise));
    this.translateService.get([copy.title, copy.description]).subscribe((texts) => {
      copy.title = texts[copy.title];
      copy.description = texts[copy.description];

      let exerciseEditModal = this.modalController.create(ExerciseEditComponent, {
        data: copy
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
    });
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
      measures: [],
      tags: []
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
    this.exercisesService.postExercise(exercise).subscribe((result) => {
      this.exercises.push(result);
      this.toastService.showSuccessToast('save-exercise-succeeded', result);
    }, (error) => {
      this.toastService.showErrorToast('save-exercise-failed', error);
    });
  }

  private updateExercise(exercise: Exercise): void {
    this.exercisesService.putExercise(exercise).subscribe((result) => {
      this.plansService.findPlansUsingExercise(exercise).switchMap((plans) => {
        return Observable.forkJoin(plans.map((plan) => {
          plan.goals.filter((goal) => goal.exercise._id === exercise._id).forEach((goal) => {
            goal.exercise = JSON.parse(JSON.stringify(exercise));
            goal.entries.filter((entry) => entry.type === EntryType.Action).forEach((entry) => {
              exercise.measures.forEach((measure) => {
                if (!entry.measurements.find((measurement) => measurement.measure === measure)) {
                  // add measurements, we now also want to track
                  entry.measurements.push(this.measurementsService.createMeasurement(measure));
                }
              });

              // remove measurements, we do not want to track anymore
              entry.measurements = entry.measurements.filter((measurement) => exercise.measures.indexOf(measurement.measure) !== -1);
            });
          });
          return plan;
        }).map((plan) => this.plansService.putPlan(plan)));
      }).subscribe((updatedPlans) => {
        console.info('Updated plans: ', updatedPlans);
      });

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
    this.exercisesService.removeExercise(exercise).subscribe((result) => {
      this.plansService.findPlansUsingExercise(exercise).switchMap((plans) => {
        return Observable.forkJoin(plans.map((plan) => {
          plan.goals = plan.goals.filter((goal) => goal.exercise._id !== exercise._id);
          return plan;
        }).map((plan) => this.plansService.putPlan(plan)));
      }).subscribe((updatedPlans) => {
        console.info('Updated plans: ', updatedPlans);
      });

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
