import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { AlertController, ModalController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/catch';

import { WorkoutCardsService, PlansService, ScoreCalculatorService, ToastService } from '../../services';
import { WorkoutCard, Workout, Mood, Measure, Measurement, Plan } from '../../model';

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
    private plansService: PlansService,
    private WorkoutCardsService: WorkoutCardsService,
    private scoreCalculatorService: ScoreCalculatorService,
    private toastService: ToastService
  ) {
  }

  public ionViewDidLoad(): void {
    this.loadWorkoutCards();
  }

  private loadWorkoutCards() {
    this.WorkoutCardsService.getWorkoutCards().subscribe((workoutCards) => {
      this.workoutCards = workoutCards;

      this.workoutCards.push(<WorkoutCard>{
        workout: {
          plan: {
            title: 'Sample',
            description: 'Sample description lalala'
          },
          start: new Date(),
          end: new Date(),
          sets: [
            { mood: Mood.Happy, measurements: [ <Measurement>{ measure: Measure.Calories, value: '500' } ] },
            { mood: Mood.Unhappy, measurements: [ { measure: Measure.Calories, value: '250' } ] },
            { mood: Mood.Happy, measurements: [ { measure: Measure.Calories, value: '750' } ] },
            { mood: Mood.Neutral, measurements: [ { measure: Measure.Calories, value: '50' } ] }
          ]
        }
      });
      this.workoutCards.push(<WorkoutCard>{
        workout: {
          plan: {
            title: 'Sample',
            description: 'Sample description lalala'
          },
          start: new Date("August 24, 2017 11:13:00"),
          end: new Date("August 24, 2017 11:15:00"),
          sets: [
            { mood: Mood.Happy, measurements: [ <Measurement>{ measure: Measure.Calories, value: '500' } ] },
            { mood: Mood.Unhappy, measurements: [ <Measurement>{ measure: Measure.Calories, value: '500' } ] },
            { mood: Mood.Unhappy, measurements: [ <Measurement>{ measure: Measure.Calories, value: '500' } ] },
            { mood: Mood.Unhappy, measurements: [ <Measurement>{ measure: Measure.Calories, value: '500' } ] },
            { mood: Mood.Unhappy, measurements: [ <Measurement>{ measure: Measure.Calories, value: '500' } ] },
            { mood: Mood.Neutral, measurements: [ <Measurement>{ measure: Measure.Calories, value: '500' } ] }
          ]
        }
      });
      this.workoutCards.push(<WorkoutCard>{
        workout: {
          plan: {
            title: 'Sample',
            description: 'Sample description lalala'
          },
          start: new Date("August 20, 2017 11:13:00"),
          end: new Date("August 20, 2017 11:15:00"),
          sets: [
            { mood: Mood.Happy, measurements: [ <Measurement>{ measure: Measure.Calories, value: '500' } ] },
            { mood: Mood.Unhappy, measurements: [ <Measurement>{ measure: Measure.Calories, value: '500' } ] },
            { mood: Mood.Happy, measurements: [ <Measurement>{ measure: Measure.Calories, value: '500' } ] },
            { mood: Mood.Happy, measurements: [ <Measurement>{ measure: Measure.Calories, value: '500' } ] },
            { mood: Mood.Happy, measurements: [ <Measurement>{ measure: Measure.Calories, value: '500' } ] },
            { mood: Mood.Happy, measurements: [ <Measurement>{ measure: Measure.Calories, value: '500' } ] },
            { mood: Mood.Neutral, measurements: [ <Measurement>{ measure: Measure.Calories, value: '500' } ] }
          ]
        }
      });
      this.workoutCards.push(<WorkoutCard>{
        workout: {
          plan: {
            title: 'Sample',
            description: 'Sample description lalala'
          },
          start: new Date("October 13, 2014 11:13:00"),
          end: new Date("October 13, 2014 11:15:00"),
          sets: [
            { mood: Mood.Happy, measurements: [ <Measurement>{ measure: Measure.Calories, value: '500' } ] },
            { mood: Mood.Unhappy, measurements: [ <Measurement>{ measure: Measure.Calories, value: '500' } ] },
            { mood: Mood.Happy, measurements: [ <Measurement>{ measure: Measure.Calories, value: '500' } ] },
            { mood: Mood.Neutral, measurements: [ <Measurement>{ measure: Measure.Calories, value: '500' } ] }
          ]
        }
      });
    });
  }

  public formatScore(workout: Workout): Observable<string> {
    return this.translateService.get('workouts.workout-score.score', { score: 42 });

    // TODO use the following code instead of the dummy calculation above
    // return this.scoreCalculatorService.calculateScoreForWorkout(workout).switchMap((score) => {
    //   return this.translateService.get('workouts.workout-score', { score });
    // });
  }

  public formatWorkoutMood(workout: Workout) {
    const moods = workout.sets.map((set) => set.mood);
    const average = Math.round(moods.reduce((prev, cur) => prev + cur, 0) / moods.length);
    console.log(moods, moods.reduce((prev, cur) => prev + cur, 0) / moods.length);
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

  public formatWorkoutDate(workout: Workout): Observable<string> {
    const start = workout.start;
    const end = workout.end;
    return Observable.forkJoin(
      this.formatDay(start),
      this.formatTime(start),
      this.formatTime(end)
    ).map((texts) => {
      const [ day, start1, end1 ] = texts;
      return `${day}, ${start1} - ${end1}`;
    });
  }

  private differenceInDays(a: Date, b: Date) {
    return Math.floor(Math.abs(a.getTime() - b.getTime()) / (1000 * 3600 * 24));
  }

  private formatDay(date: Date): Observable<string> {
    const now = new Date();
    const diff = this.differenceInDays(date, now);
    if (diff === 0) {
      return this.translateService.get('today');
    } else if (diff === 1) {
      return this.translateService.get('yesterday');
    } else if (diff <= 7) {
      return this.translateService.get('xdaysago', { days: diff });
    }

    return this.translateService.get('shortDateFormat').map((shortDateFormat) => {
      return new DatePipe(this.translateService.currentLang)
        .transform(date, shortDateFormat);
    });
  }

  private formatTime(date: Date): Observable<string> {
    return this.translateService.get('shortTimeFormat').map((shortTimeFormat) => {
      return new DatePipe(this.translateService.currentLang)
        .transform(date, shortTimeFormat);
    })
  }

  public confirmDeleteWorkoutCard(workoutCard: WorkoutCard) {
    // TODO implement me somehow
  }

  public workoutCardSelected(workoutCard: WorkoutCard) {
    // TODO implement me somehow
  }

  public startWorkoutClicked($event: any) {
    this.plansService.getPlans().subscribe((plans) => {
      const inputs = plans.map((plan) => ({
        type: 'radio',
        value: plan._id,
        label: plan.title
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
  }

  private startWorkout(plan: Plan) {
    console.log('Starting workout for', plan);
  }
}
