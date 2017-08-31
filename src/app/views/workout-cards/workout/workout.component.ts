import { Component, ComponentFactoryResolver, ViewChild,
  ViewChildren, QueryList, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, NavParams, ViewController, Slides, Slide } from 'ionic-angular';

import { WorkoutCardsService, WorkoutsService, ScoreCalculatorService } from '../../../services';
import { WorkoutCard, Workout, Plan, EntryType, Mood, Set, Measurement } from '../../../model';

import { Step } from './model';
import { ChronometerComponent } from '../../measurements';
import { ActionStepComponent } from './action-step';
import { PauseStepComponent } from './pause-step';
import { SlideHostDirective } from './slide-host';

@Component({
  selector: 'workout',
  templateUrl: './workout.component.html'
})
export class WorkoutComponent implements OnInit, AfterViewInit {
  @Output()
  public workoutChanged = new EventEmitter<Workout>();

  private workout: Workout;
  private workoutCard: WorkoutCard;

  public score = 0;

  @ViewChild('slides')
  public slides: Slides;

  @ViewChildren(SlideHostDirective)
  public slideHosts: QueryList<SlideHostDirective>;

  private steps: Step[] = [];

  private recentStep: Step;

  public constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private translateService: TranslateService,
    private alertController: AlertController,
    private navParams: NavParams,
    private viewController: ViewController,
    private workoutsService: WorkoutsService,
    private scoreCalculatorService: ScoreCalculatorService
  ) {
    console.log('creating workout');
    this.workout = this.navParams.get('data');
  }

  public ngOnInit(): void {
    this.initializeSteps();
  }
  
  private initializeSteps() {
    this.workout.plan.goals.forEach((goal, goalIndex) => {
      let actionIndex = 0;
      goal.entries.forEach((entry, entryIndex) => {
        const measurements: Array<{ original: Measurement, actual: Measurement }> = entry.measurements.map((measurement) => ({
          original: measurement,
          actual: JSON.parse(JSON.stringify(measurement))
        }));

        const set: Set = entry.type === EntryType.Action && {
          goal,
          measurements: [],
          mood: Mood.Neutral,
          note: ''
        };

        this.steps.push({
          goal,
          goalIndex,
          entry,
          entryIndex,
          set,
          measurements,
          actionIndex
        });

        if (entry.type === EntryType.Action) {
          actionIndex++;
        }
      });
    });
    console.log(this.steps);
  }

  public ngAfterViewInit(): void {
    this.renderActiveStep();
  }
  
  public get activeStepIndex(): number {
    return this.slides.getActiveIndex() || 0;
  }
  
  private get activeStep(): Step | undefined {
    return this.steps[this.activeStepIndex];
  }

  private get activeStepSlideHost(): SlideHostDirective {
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

  public stepChanged(): void {
    console.log('activeSlideHost', this.activeStepIndex, this.activeStep, this.activeStepSlideHost);

    if (this.recentStep) {
      this.slideHosts.find((slideHost) => slideHost.data === this.recentStep).viewContainerRef.clear();
    }

    this.updateWorkout();
    this.renderActiveStep();
  }

  private renderActiveStep() {
    console.log('rendering active step', this.steps, this.activeStepIndex, this.activeStep);
    const activeStep = this.activeStep;
    const activeStepSlideHost = this.activeStepSlideHost;
    
    let componentFactory = null;
    if (activeStep.entry.type === EntryType.Action) {
      componentFactory = this.componentFactoryResolver.resolveComponentFactory(ActionStepComponent);
    } else if (activeStep.entry.type === EntryType.Pause) {
      componentFactory = this.componentFactoryResolver.resolveComponentFactory(PauseStepComponent);
    }

    activeStepSlideHost.viewContainerRef.clear();
    const componentRef = activeStepSlideHost.viewContainerRef.createComponent(componentFactory);

    if (activeStep.entry.type === EntryType.Action) {
      const actionStep = <ActionStepComponent>componentRef.instance;
      actionStep.step = activeStep;
      actionStep.complete.subscribe(() => {
        console.log('action completed');
      });
    } else if (activeStep.entry.type === EntryType.Pause) {
      const pauseStep = <PauseStepComponent>componentRef.instance;
      pauseStep.step = activeStep;
      pauseStep.complete.subscribe(() => {
        console.log('pause completed');
        this.slides.slideNext();
      });
    }

    this.recentStep = activeStep;
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
                    workout: this.workout
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
        workout: this.workout
      }
    });
  }

  private updateWorkout() {
    if (this.recentStep && this.recentStep.set) {
      this.recentStep.set.measurements = this.recentStep.measurements
        .map((measurement) => measurement.actual);
    }

    this.workout.sets = this.steps.filter((step) => !!step.set).map((step) => step.set);
    this.scoreCalculatorService.calculateScoreForWorkout(this.workout).subscribe((score) => {
      this.score = score;
      console.log('score', score);
    });

    this.workout.end = new Date();
    this.workoutChanged.emit(this.workout);
    // TODO move this somehow out of this component
    this.workoutsService.updateWorkout(this.workout).subscribe((savedWorkout) => {
      console.log('Workout saved', savedWorkout);
    });
  }
}
