import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, ToastController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { Workout } from '../../model';
import { WorkoutsService, WorkoutCardsService, ToastService, by } from '../../services';

import { WorkoutEditComponent } from './workout-edit';

@Component({
  selector: 'workout-history',
  templateUrl: './workout-history.component.html'
})
export class WorkoutHistoryComponent {
  private workouts: Workout[] = [];
  public months: any = {};

  public constructor(
    private translateService: TranslateService,
    private modalController: ModalController,
    private toastService: ToastService,
    private alertController: AlertController,
    private workoutsService: WorkoutsService,
    private workoutCardsService: WorkoutCardsService
  ) {
  }

  public ionViewDidLoad(): void {
    this.loadWorkouts();
  }

  private loadWorkouts() {
    this.workoutsService.getWorkouts().subscribe((workouts) => {
      console.log(workouts);
      this.workouts = workouts.map((workout) => this.workoutsService.loadWorkout(workout));
      this.reindexWorkouts();
    });
  }

  private reindexWorkouts() {
    this.months = {};
    this.workouts = this.workouts
      .sort(by<Workout>((workout) => -workout.start.getTime()))
      .map((workout) => {
        workout.transient = workout.transient || {};
        workout.transient.month = undefined;

        const monthIndex = `${workout.start.getFullYear()}/${workout.start.getMonth()}`;
        if (this.months[monthIndex]) {
          this.months[monthIndex].countWorkouts++;
        } else {
          workout.transient.month = this.months[monthIndex] = {
            date: workout.start,
            year: workout.start.getFullYear(),
            month: workout.start.getMonth(),
            countWorkouts: 1
          };
        }

        return workout;
      });
  }
  
  public workoutSelected(workout: Workout): void {
    const transient = workout.transient;
    workout.transient = undefined;
    const copy = this.workoutsService.deserializeWorkout(JSON.parse(JSON.stringify(workout)));
    workout.transient = transient;

    let workoutEditModal = this.modalController.create(WorkoutEditComponent, {
      data: copy
    });

    workoutEditModal.onDidDismiss((result) => {
      if (!result) {
        return;
      }

      if (result.success) {
        this.updateWorkout(result.data);
      } else if (result.delete) {
        this.deleteWorkout(result.data);
      }
    });
    workoutEditModal.present();
  }

  public confirmDeleteWorkout(workout: Workout): void {
    this.translateService.get(['workout-delete.title', 'workout-delete.prompt', 'yes', 'no'])
      .subscribe((texts) => {
        const alert = this.alertController.create({
          title: texts['workout-delete.title'],
          message: texts['workout-delete.prompt'],
          buttons: [
            {
              text: texts['no'],
              role: 'cancel'
            },
            {
              text: texts['yes'],
              handler: () => {
                this.deleteWorkout(workout);
              }
            }
          ]
        });
        alert.present();
      });
  }

  private updateWorkout(workout: Workout): void {
    this.workoutsService.putWorkout(workout).subscribe((result) => {
      const index = this.workouts.findIndex((e) => e._id === workout._id);
      if (index !== -1) {
        this.workouts.splice(index, 1, this.workoutsService.loadWorkout(result));
        this.reindexWorkouts();
      }
      this.toastService.showSuccessToast('save-workout-succeeded', result);
    }, (error) => {
      this.toastService.showErrorToast('save-workout-failed', error);
    });
  }

  private deleteWorkout(workout: Workout): void {
    this.workoutCardsService.getWorkoutCardByWorkout(workout).subscribe((workoutCards) => {
      if (workoutCards.length > 0) {
        Observable.forkJoin(...workoutCards.map((workoutCard) => this.workoutCardsService.removeWorkoutCard(workoutCard))).subscribe((result) => {
          this.deleteWorkout1(workout);
        });
      } else {
        this.deleteWorkout1(workout);
      }
    }, (error) => {
      this.toastService.showErrorToast('delete-workout-failed', error);
    });
  }

  private deleteWorkout1(workout: Workout) {
    this.workoutsService.removeWorkout(workout).subscribe((result) => {
      const index = this.workouts.indexOf(workout);
      if (index !== -1) {
        this.workouts.splice(index, 1);
        this.reindexWorkouts();
      }
      this.toastService.showSuccessToast('delete-workout-succeeded', result);
    }, (error) => {
      this.toastService.showErrorToast('delete-workout-failed', error);
    });
  }
}
