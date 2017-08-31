import { Component, ComponentFactoryResolver, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, NavParams, ViewController, Slides, Slide } from 'ionic-angular';

import { WorkoutCardsService, WorkoutsService, ScoreCalculatorService } from '../../../services';
import { WorkoutCard, Workout, Plan, EntryType } from '../../../model';

import { ChronometerComponent } from '../../measurements';
import { ActionStep } from './action-step';
import { PauseStep } from './pause-step';
import { SlideHostDirective } from './slide-host';

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

  @ViewChildren(SlideHostDirective)
  public slideHosts: QueryList<SlideHostDirective>;

  private steps = [];

  public constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
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
    console.log('creating workout');
    this.workoutsService.createWorkout({
      start: new Date(),
      end: new Date(),
      plan: this.navParams.get('data'),
      sets: []
    }).subscribe((workout) => {
      console.log('created workout', workout);
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
  
  public get activeStepIndex(): number {
    return this.slides.getActiveIndex();
  }
  
  private get activeStep() {
    return this.steps[this.activeStepIndex];
  }

  private get activeStepSlideHost() {
    return this.slideHosts.find((slideHost) => slideHost.data === this.activeStep);
  }
  
  public get activeStepGoalIndex(): number {
    const activeStep = this.activeStep;
    if (!activeStep) {
      return 0;
    }

    return activeStep.goalIndex;
  }

  public get activeStepActionIndex(): number {
    const activeStep = this.activeStep;
    if (!activeStep) {
      return 0;
    }

    return activeStep.actionIndex;
  }

  public get activeStepEntryIsPause(): boolean {
    const activeStep = this.activeStep;
    return activeStep && activeStep.entry.type === EntryType.Pause;
  }

  public get activeStepEntryIsAction(): boolean {
    const activeStep = this.activeStep;
    return activeStep && activeStep.entry.type === EntryType.Action;
  }

  public previousStepClicked(): void {
    this.slides.slidePrev();
  }
  
  public nextStepClicked(): void {
    if (this.activeStepIndex === this.steps.length - 1) {
      this.saveWorkoutClicked();
    } else {
      this.slides.slideNext();
    }
  }

  public stepChanged(x: any): void {
    console.log('activeSlideHost', this.activeStepIndex, this.activeStep, this.activeStepSlideHost);

    const activeStep = this.activeStep;
    const activeStepSlideHost = this.activeStepSlideHost;
    
    let componentFactory = null;
    if (activeStep.entry.type === EntryType.Action) {
      componentFactory = this.componentFactoryResolver.resolveComponentFactory(ActionStep);
    } else if (activeStep.entry.type === EntryType.Pause) {
      componentFactory = this.componentFactoryResolver.resolveComponentFactory(PauseStep);
    }

    activeStepSlideHost.viewContainerRef.clear();
    const componentRef = activeStepSlideHost.viewContainerRef.createComponent(componentFactory);

    if (activeStep.entry.type === EntryType.Action) {
      const actionStep = <ActionStep>componentRef.instance;
      actionStep.step = activeStep;
    } else if (activeStep.entry.type === EntryType.Pause) {
      const pauseStep = <PauseStep>componentRef.instance;
      pauseStep.step = activeStep;
    }

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
