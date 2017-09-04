import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AlertController, ModalController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/catch';

import { WorkoutCardsService, WorkoutsService, DateFormatService,
  PlansService, ScoreCalculatorService, ToastService } from '../../services';
import { WorkoutCard, Workout, Mood, Measure, Measurement, Plan } from '../../model';

import { WorkoutComponent } from './workout';

@Component({
  selector: 'workout-cards',
  templateUrl: './workout-cards.component.html'
})
export class WorkoutCardsComponent {
  private workoutCards: WorkoutCard[] = [];

  public constructor(
    private translateService: TranslateService,
    private alertController: AlertController,
    private modalController: ModalController,
    private dateFormatService: DateFormatService,
    private plansService: PlansService,
    private workoutCardsService: WorkoutCardsService,
    private workoutsService: WorkoutsService,
    private scoreCalculatorService: ScoreCalculatorService,
    private toastService: ToastService
  ) {
  }

  public ionViewDidLoad(): void {
    this.loadWorkoutCards();
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
        this.loadWorkoutCard(workoutCard, workout);
      });
      return;
    }

    workoutCard.transient = { workout };
    workoutCard.transient.score = this.loadWorkoutCardScore(workoutCard);
    workoutCard.transient.mood = this.loadWorkoutCardMood(workoutCard);
    workoutCard.transient.date = this.loadWorkoutCardDate(workoutCard);
  }

  private loadWorkoutCardScore(workoutCard: WorkoutCard): Observable<string> {
    return this.scoreCalculatorService.calculateScoreForWorkout(workoutCard.transient.workout).switchMap((score) => {
      return this.translateService.get('workouts.workout-score.score', { score });
    });
  }

  private loadWorkoutCardMood(workoutCard: WorkoutCard): string {
    if (workoutCard.transient.workout.sets.length === 0) {
      return 'neutral';
    }

    const moods = workoutCard.transient.workout.sets.filter((set) => !!set.mood).map((set) => set.mood);
    if (moods.length === 0) {
      return 'neutral';
    }

    const average = Math.round(moods.reduce((prev, cur) => prev + cur, 0) / moods.length);
    switch (average) {
      case Mood.Happy:
        return 'happy';
      case Mood.Neutral:
        return 'neutral';
      case Mood.Unhappy:
        return 'unhappy';
      default:
        return 'unknown' + average;
    }
  }

  private loadWorkoutCardDate(workoutCard: WorkoutCard): Observable<string> {
    const start = workoutCard.transient.workout.start;
    const end = workoutCard.transient.workout.end;
    return Observable.forkJoin(
      this.dateFormatService.formatDay(start),
      this.dateFormatService.formatTime(start),
      this.dateFormatService.formatTime(end)
    ).map((texts) => {
      const [ day, start1, end1 ] = texts;
      return `${day}, ${start1} - ${end1}`;
    });
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
    this.translateService.get(['workout-card-delete.title', 'workout-card-delete.prompt', 'yes', 'no'])
    .subscribe((texts) => {
      const alert = this.alertController.create({
        title: texts['workout-card-delete.title'],
        message: texts['workout-card-delete.prompt'],
        buttons: [
          {
            text: texts['no'],
            role: 'cancel'
          },
          {
            text: texts['yes'],
            handler: () => {
              this.deleteWorkoutCard(workoutCard);
            }
          }
        ]
      });
      alert.present();
    });
  }

  public workoutCardSelected(workoutCard: WorkoutCard) {
    // TODO implement me somehow
  }

  public startWorkoutClicked($event: any) {
    this.plansService.getPlans().subscribe((plans) => {
      this.translateService.get(plans.map((plan) => plan.title)).subscribe((texts) => {
        const inputs = plans.map((plan) => ({
          type: 'radio',
          value: plan._id,
          label: texts[plan.title]
        }));

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
    });
  }

  private startWorkout(plan: Plan) {
    console.log('Starting workout for', plan);
    this.workoutsService.createWorkout({
      start: new Date(),
      end: new Date(),
      plan,
      sets: []
    }).subscribe((workout) => {
      console.log('created workout', workout);

      this.workoutCardsService.createWorkoutCard({
        workoutId: workout._id,
        transient: { workout }
      }).subscribe((workoutCard) => {
        const workoutModal = this.modalController.create(WorkoutComponent, {
          data: workout
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
    this.workoutsService.deleteWorkout(workout).subscribe((result) => {
      this.toastService.showSuccessToast('delete-workout-succeeded', workout);
    }, (error) => {
      this.toastService.showErrorToast('delete-workout-failed', error);
    });
  }

  private deleteWorkoutCard(workoutCard: WorkoutCard, hideToast: boolean = false) {
    this.workoutCardsService.deleteWorkoutCard(workoutCard).subscribe((result) => {
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
