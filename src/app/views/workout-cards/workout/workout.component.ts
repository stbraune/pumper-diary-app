import { Component, ComponentFactoryResolver, ViewChild,
  ViewChildren, QueryList, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, NavParams, ViewController, Slides, Slide } from 'ionic-angular';

import { Insomnia } from '@ionic-native/insomnia';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skipUntil';

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

  private saveWorkoutObservable;
  
  private previousActionStepTemp = {
    activeStepIndex: -1,
    previousActionStep: undefined
  };
  
  private nextActionStepTemp = {
    activeStepIndex: -1,
    nextActionStep: undefined
  };

  public constructor(
    private insomnia: Insomnia,
    private componentFactoryResolver: ComponentFactoryResolver,
    private translateService: TranslateService,
    private alertController: AlertController,
    private navParams: NavParams,
    private viewController: ViewController,
    private workoutsService: WorkoutsService,
    private scoreCalculatorService: ScoreCalculatorService
  ) {
    this.workout = this.navParams.get('data');
  }

  public ngOnInit(): void {
    this.initializeSteps();

    // TODO move this somehow out of this component
    this.saveWorkoutObservable = new Subject<Workout>();
    this.workoutChanged
      .skipUntil(this.saveWorkoutObservable)
      .debounceTime(500)
      .subscribe((workout) => {
        this.workoutsService.updateWorkout(workout).subscribe((savedWorkout) => {
          this.saveWorkoutObservable.next(savedWorkout);
          console.log('Workout saved', savedWorkout);
        });
      });
    this.saveWorkoutObservable.next(this.workout);
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
          goalId: goal.id,
          exercise: goal.exercise,
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
  }

  public ngAfterViewInit(): void {
    this.renderActiveStep();
    this.insomnia.keepAwake();
  }
  
  public get activeStepIndex(): number {
    return Math.min(this.slides.getActiveIndex() || 0, this.steps.length - 1);
  }
  
  private get activeStep(): Step | undefined {
    return this.steps[this.activeStepIndex];
  }

  private get previousStep(): Step | undefined {
    const previousIndex = this.activeStepIndex - 1;
    if (previousIndex >= 0 && this.steps[previousIndex]) {
      return this.steps[previousIndex];
    }
  }

  private get previousActionStep(): Step | undefined {
    const activeStepIndex = this.activeStepIndex;
    if (this.previousActionStepTemp.activeStepIndex === activeStepIndex) {
      return this.previousActionStepTemp.previousActionStep;
    }

    let previousIndex = activeStepIndex - 1;
    let previousStep = previousIndex >= 0 && this.steps[previousIndex];
    while (previousStep && !this.stepIsAction(previousStep)) {
      previousIndex--;
      previousStep = previousIndex >= 0 && this.steps[previousIndex];
    }
    
    this.previousActionStepTemp.activeStepIndex = activeStepIndex;
    this.previousActionStepTemp.previousActionStep = previousStep;
    return previousStep;
  }

  private get nextStep(): Step | undefined {
    const nextIndex = this.activeStepIndex + 1;
    if (nextIndex < this.steps.length) {
      return this.steps[nextIndex];
    }
  }

  private get nextActionStep(): Step | undefined {
    const activeStepIndex = this.activeStepIndex;
    if (this.nextActionStepTemp.activeStepIndex === activeStepIndex) {
      return this.nextActionStepTemp.nextActionStep;
    }

    let nextIndex = activeStepIndex + 1;
    let nextStep = nextIndex < this.steps.length && this.steps[nextIndex];
    while (nextStep && !this.stepIsAction(nextStep)) {
      nextIndex++;
      nextStep = nextIndex < this.steps.length && this.steps[nextIndex];
    }

    this.nextActionStepTemp.activeStepIndex = activeStepIndex;
    this.nextActionStepTemp.nextActionStep = nextStep;
    return nextStep;
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
    return this.stepIsPause(this.activeStep);
  }

  public get activeStepEntryIsAction(): boolean {
    return this.stepIsAction(this.activeStep);
  }

  public stepIsPause(step: Step): boolean {
    return step && step.entry.type === EntryType.Pause;
  }

  public stepIsAction(step: Step): boolean {
    return step && step.entry.type === EntryType.Action;
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
    if (this.recentStep) {
      this.slideHosts.find((slideHost) => slideHost.data === this.recentStep).viewContainerRef.clear();
    }

    
    if (this.activeStepIndex >= this.steps.length) {
      this.saveWorkoutClicked();
    } else {
      this.updateWorkout();
      this.renderActiveStep();
    }
  }

  private renderActiveStep() {
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
    this.translateService.get(['workout-cancel.title', 'workout-cancel.prompt', 'yes', 'no'])
      .subscribe((texts) => {
        const alert = this.alertController.create({
          title: texts['workout-cancel.title'],
          message: texts['workout-cancel.prompt'],
          buttons: [
            {
              text: texts['no'],
              role: 'cancel'
            },
            {
              text: texts['yes'],
              handler: () => {
                this.insomnia.allowSleepAgain();
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
    this.translateService.get(['workout-finish.title', 'workout-finish.prompt', 'yes', 'no'])
      .subscribe((texts) => {
        const alert = this.alertController.create({
          title: texts['workout-finish.title'],
          message: texts['workout-finish.prompt'],
          buttons: [
            {
              text: texts['no'],
              role: 'cancel'
            },
            {
              text: texts['yes'],
              handler: () => {
                this.updateWorkout();
                this.insomnia.allowSleepAgain();
                this.viewController.dismiss({
                  success: true,
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

  private updateWorkout() {
    if (this.recentStep && this.recentStep.set) {
      this.recentStep.set.measurements = this.recentStep.measurements
        .map((measurement) => measurement.actual);
    }

    this.workout.sets = this.steps.filter((step) => !!step.set).map((step) => step.set);
    this.scoreCalculatorService.calculateScoreForWorkout(this.workout).subscribe((score) => {
      this.score = score;
    });

    this.workout.end = new Date();
    this.workoutChanged.emit(this.workout);
  }
}
