import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AlertController, ModalController, NavController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/catch';

import { WorkoutCardsService, WorkoutsService, PlansService, ToastService } from '../../services';
import { WorkoutCard, Workout, Plan } from '../../model';

import { WorkoutComponent } from './workout';
import { WorkoutViewComponent } from './../workout-history/workout-view';

@Component({
  selector: 'workout-cards',
  templateUrl: './workout-cards.component.html'
})
export class WorkoutCardsComponent {
  private workoutCards: WorkoutCard[] = [];
  private workoutModal;

  public constructor(
    private translateService: TranslateService,
    private alertController: AlertController,
    private modalController: ModalController,
    private navController: NavController,
    private plansService: PlansService,
    private workoutCardsService: WorkoutCardsService,
    private workoutsService: WorkoutsService,
    private toastService: ToastService
  ) {
  }

  public ionViewDidLoad(): void {
    this.loadWorkoutCards();
  }

  public shouldShowWelcomeCard(): boolean {
    return true;
  }

  private loadWorkoutCards() {
    this.workoutCardsService.getWorkoutCards().subscribe((workoutCards) => {
      this.workoutCards = workoutCards;
      this.workoutCards.forEach((workoutCard) => {
        this.loadWorkoutCard(workoutCard);
      });
    });
  }

  private loadWorkoutCard(workoutCard: WorkoutCard, workout?: Workout) {
    if (!workout) {
      this.workoutsService.getWorkoutById(workoutCard.workoutId).subscribe((workout) => {
        this.loadWorkoutCard(workoutCard, this.workoutsService.loadWorkout(workout));
      });
      return;
    }

    workoutCard.transient = { workout: this.workoutsService.loadWorkout(workout) };
  }

  public formatScore(workoutCard: WorkoutCard): Observable<string> {
    return workoutCard.transient.score;
  }

  public formatWorkoutMood(workoutCard: WorkoutCard): string {
    return workoutCard.transient.mood;
  }

  public formatWorkoutDate(workoutCard: WorkoutCard): Observable<string> {
    return workoutCard.transient.date;
  }

  public confirmDeleteWorkoutCard(workoutCard: WorkoutCard) {
    this.translateService.get(['workout-card-delete.title', 'workout-card-delete.prompt', 'workout-card-delete.delete-workout-too', 'yes', 'no'])
      .subscribe((texts) => {
        const alert = this.alertController.create({
          title: texts['workout-card-delete.title'],
          message: texts['workout-card-delete.prompt'],
          inputs: [
            {
              type: 'checkbox',
              label: texts['workout-card-delete.delete-workout-too'],
              value: 'true'
            }
          ],
          buttons: [
            {
              text: texts['no'],
              role: 'cancel'
            },
            {
              text: texts['yes'],
              handler: (data) => {
                if (data.length > 0 && workoutCard.transient && workoutCard.transient.workout) {
                  this.deleteWorkout(workoutCard.transient.workout);
                }
                this.deleteWorkoutCard(workoutCard);
              }
            }
          ]
        });
        alert.present();
    });
  }

  public workoutCardSelected(workoutCard: WorkoutCard) {
    if (workoutCard.transient.workout) {
      this.navController.push(WorkoutViewComponent, {
        workout: workoutCard.transient.workout
      });
    }
  }

  public startWorkoutClicked($event: any) {
    this.plansService.getPlans()
      .switchMap((plans) => this.createPlansRadioBoxes(plans))
      .subscribe((inputs) => {
        this.translateService.get([
          'workouts.start-workout.title', 'workouts.start-workout.message',
          'workouts.start-workout.start', 'cancel'
        ]).subscribe((texts) => {
          const alert = this.alertController.create({
            title: texts['workouts.start-workout.title'],
            message: texts['workouts.start-workout.message'],
            inputs,
            buttons: [
              {
                text: texts['cancel'],
                role: 'cancel'
              },
              {
                text: texts['workouts.start-workout.start'],
                handler: (data) => {
                  if (!data) {
                    this.toastService.showErrorToast('workouts.start-workout.no-plan-selected',
                      undefined, 3000);
                    return false;
                  }
  
                  this.plansService.getPlanById(data).subscribe((plan) => {
                    this.startWorkout(plan);
                  }, (error) => {
                    this.toastService.showErrorToast('workouts.start-workout.no-plan-selected');
                  });
                }
              }
            ]
          });
          alert.present();
        });
      });
  }

  private createPlansRadioBoxes(plans: Plan[]): Observable<any[]> {
    if (plans.length === 0) {
      return Observable.of([]);
    }

    return this.translateService.get(plans.map((plan) => plan.title)).map((texts) => {
      return plans.map((plan) => ({
        type: 'radio',
        value: plan._id,
        label: texts[plan.title]
      }));
    });
  }

  private startWorkout(plan: Plan) {
    console.log('Starting workout for', plan);
    this.workoutsService.postWorkout({
      start: new Date(),
      end: new Date(),
      plan,
      sets: []
    }).subscribe((workout) => {
      this.workoutCardsService.postWorkoutCard({
        workoutId: workout._id,
        transient: { workout }
      }).subscribe((workoutCard) => {
        const workoutModal = this.workoutModal = this.modalController.create(WorkoutComponent, {
          data: this.workoutsService.loadWorkout(workout)
        });
        workoutModal.onDidDismiss((result) => {
          if (result && result.delete) {
            this.deleteWorkout(workout);
            this.deleteWorkoutCard(workoutCard, true);
          } else if (result.success) {
            this.loadWorkoutCard(workoutCard, workout);
            this.workoutCards.unshift(workoutCard);
          }
        });
        workoutModal.present();
      });
    });
  }

  private deleteWorkout(workout: Workout) {
    this.workoutsService.removeWorkout(workout).subscribe((result) => {
      this.toastService.showSuccessToast('delete-workout-succeeded', workout);
    }, (error) => {
      this.toastService.showErrorToast('delete-workout-failed', error);
    });
  }

  private deleteWorkoutCard(workoutCard: WorkoutCard, hideToast: boolean = false) {
    this.workoutCardsService.removeWorkoutCard(workoutCard).subscribe((result) => {
      const index = this.workoutCards.indexOf(workoutCard);
      if (index !== -1) {
        this.workoutCards.splice(index, 1);
      }

      if (hideToast) {
        console.log('Workout card deleted', workoutCard);
      } else {
        this.toastService.showSuccessToast('delete-workout-card-succeeded', workoutCard);
      }
    }, (error) => {
      if (hideToast) {
        console.warn('Could not delete workout card', error);
      } else {
        this.toastService.showErrorToast('delete-workout-card-failed', error);
      }
    });
  }
}
