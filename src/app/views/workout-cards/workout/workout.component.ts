import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, NavParams, ViewController } from 'ionic-angular';

import { WorkoutCardsService, WorkoutsService } from '../../../services';
import { WorkoutCard, Workout, Plan } from '../../../model';

@Component({
  selector: 'workout',
  templateUrl: './workout.component.html'
})
export class WorkoutComponent {
  private workout: Workout;
  private workoutCard: WorkoutCard;

  public constructor(
    private translateService: TranslateService,
    private alertController: AlertController,
    private navParams: NavParams,
    private viewController: ViewController,
    private workoutsService: WorkoutsService,
    private workoutCardsService: WorkoutCardsService
  ) {
    this.workoutsService.createWorkout({
      start: new Date(),
      end: new Date(),
      plan: this.navParams.get('data'),
      sets: []
    }).subscribe((workout) => {
      this.workout = workout;

      this.workoutCardsService.createWorkoutCard({
        workoutId: this.workout._id,
        workout: this.workout
      }).subscribe((workoutCard) => {
        this.workoutCard = workoutCard;
      });
    });
  }

  public dismissWorkoutClicked(): void {
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
                this.updateWorkout();
                this.viewController.dismiss({
                  success: false,
                  delete: true,
                  data: {
                    workout: this.workout,
                    workoutCard: this.workoutCard
                  }
                });
              }
            }
          ]
        });
      alert.present();
    });
  }

  public saveWorkoutClicked(): void {
    this.viewController.dismiss({
      success: true,
      data: {
        workout: this.workout,
        workoutCard: this.workoutCard
      }
    });
  }

  private updateWorkout() {
    this.workoutsService.updateWorkout(this.workout).subscribe((savedWorkout) => {
      console.log('Workout saved', savedWorkout);
    });
  }
}
