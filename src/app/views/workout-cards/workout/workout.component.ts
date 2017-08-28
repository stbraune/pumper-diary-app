import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, NavParams, ViewController, Slides } from 'ionic-angular';

import { WorkoutCardsService, WorkoutsService, ScoreCalculatorService } from '../../../services';
import { WorkoutCard, Workout, Plan, EntryType } from '../../../model';

@Component({
  selector: 'workout',
  templateUrl: './workout.component.html'
})
export class WorkoutComponent {
  private workout: Workout;
  private workoutCard: WorkoutCard;

  public score = 0;

  @ViewChild('slides')
  public slides: Slides;

  private steps = [];

  public constructor(
    private translateService: TranslateService,
    private alertController: AlertController,
    private navParams: NavParams,
    private viewController: ViewController,
    private workoutsService: WorkoutsService,
    private workoutCardsService: WorkoutCardsService,
    private scoreCalculatorService: ScoreCalculatorService
  ) {
  }

  public ionViewDidLoad() {
    this.workoutsService.createWorkout({
      start: new Date(),
      end: new Date(),
      plan: this.navParams.get('data'),
      sets: []
    }).subscribe((workout) => {
      this.workout = workout;
      this.initializeSteps();

      this.workoutCardsService.createWorkoutCard({
        workoutId: this.workout._id,
        workout: this.workout
      }).subscribe((workoutCard) => {
        this.workoutCard = workoutCard;
      });
    });
  }

  private initializeSteps() {
    this.workout.plan.goals.forEach((goal, goalIndex) => {
      let actionIndex = 0;
      goal.entries.forEach((entry, entryIndex) => {
        this.steps.push({
          goal,
          goalIndex,
          entry,
          entryIndex,
          actionIndex
        });

        if (entry.type === EntryType.Action) {
          actionIndex++;
        }
      });
    });

    console.log(this.steps);
  }

  public get currentEntryIsPause(): boolean {
    return this.activeStep && this.activeStep.entry.type === EntryType.Pause;
  }

  public get currentEntryIsAction(): boolean {
    return this.activeStep && this.activeStep.entry.type === EntryType.Action;
  }

  public get currentGoalIndex(): number {
    if (!this.activeStep) {
      return 0;
    }

    return this.activeStep.goalIndex;
  }

  public get currentGoalPosition(): number {
    if (!this.activeStep) {
      return 0;
    }

    return this.activeStep.actionIndex;
  }

  public get currentStepIndex(): number {
    return this.slides.getActiveIndex();
  }

  private get activeStep() {
    const activeIndex = this.slides.getActiveIndex();
    return this.steps[activeIndex];
  }

  public previousStepClicked(): void {
    this.slides.slidePrev();
  }
  
  public nextStepClicked(): void {
    if (this.currentStepIndex === this.steps.length - 1) {
      this.saveWorkoutClicked();
    } else {
      this.slides.slideNext();
    }
  }

  public stepChanged(): void {
    this.updateWorkout();
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
    this.updateWorkout();
    this.viewController.dismiss({
      success: true,
      data: {
        workout: this.workout,
        workoutCard: this.workoutCard
      }
    });
  }

  private updateWorkout() {
    this.scoreCalculatorService.calculateScoreForWorkout(this.workout).subscribe((score) => {
      this.score = score;
    });

    this.workout.end = new Date();
    this.workoutsService.updateWorkout(this.workout).subscribe((savedWorkout) => {
      console.log('Workout saved', savedWorkout);
    });
  }
}
