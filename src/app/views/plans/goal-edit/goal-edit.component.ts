import { Component, ViewChild } from '@angular/core';

import {
  FabContainer,
  NavParams,
  PopoverController,
  ViewController,
  Select
} from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import {
  Goal,
  Entry,
  EntryType,
  Exercise
} from '../../../model';

import {
  ExercisesService,
  MeasurementsService,
  ToastService
} from '../../../services';

import {
  EntryPopoverMenuComponent
} from '../entry-popover-menu';

@Component({
  selector: 'goal-edit',
  templateUrl: './goal-edit.component.html'
})
export class GoalEditComponent {
  private goal: Goal;
  private exercise: string;
  private exercises: Exercise[] = [];

  public constructor(
    private navParams: NavParams,
    private popoverController: PopoverController,
    private toastService: ToastService,
    private viewController: ViewController,
    private exercisesService: ExercisesService,
    private measurementsService: MeasurementsService
  ) {
    this.goal = this.navParams.get('data');
  }

  public ionViewDidLoad(): void {
    this.exercise = this.goal.exercise ? this.goal.exercise._id : '';
    this.loadExercises();
  }

  private loadExercises() {
    this.exercisesService.getExercises().subscribe((exercises) => {
      this.exercises = exercises;
    });
  }

  public exerciseSelected(): void {
    console.log('exercise selected', this.exercise);
    this.exercisesService.getExerciseById(this.exercise).subscribe((exercise) => {
      this.goal.exercise = exercise;
    }, (error) => {
      this.toastService.showErrorToast('set-exercise-failed', error);
    });
  }

  public reorderEntries($event: any) {
    let entry = this.goal.entries[$event.from];
    if (entry) {
      this.goal.entries.splice($event.from, 1);
      this.goal.entries.splice($event.to, 0, entry);
    }
  }

  public isPause(entry: Entry): boolean {
    return entry.type === EntryType.Pause;
  }

  public isAction(entry: Entry): boolean {
    return entry.type === EntryType.Action;
  }

  public openEntryPopoverMenu($event: any): void {
    let popover = this.popoverController.create(EntryPopoverMenuComponent, {
      entry: $event.entry,
      deleteClicked: (entry: Entry) => {
        this.goal.entries.splice(this.goal.entries.indexOf(entry), 1);
      }
    });
    popover.present({ ev: $event });
  }

  public addActionClicked($event: any, fabContainer: FabContainer): void {
    if (!this.goal.exercise) {
      this.toastService.showErrorToast('no-exercise-selected', undefined, 3000);
      return;
    }

    this.exercisesService.getExerciseById(this.goal.exercise._id).subscribe((exercise) => {
      this.goal.entries.push({
        type: EntryType.Action,
        measurements: exercise.measures.map((measure) => this.measurementsService.createMeasurement(measure))
      });
      fabContainer.close();
    }, (error) => {
      this.toastService.showErrorToast('add-action-failed', error);
    });
  }

  public addPauseClicked($event: any, fabContainer: FabContainer): void {
    if (!this.goal.exercise) {
      this.toastService.showErrorToast('no-exercise-selected', undefined, 3000);
      return;
    }

    this.goal.entries.push({
      type: EntryType.Pause,
      measurements: [ this.measurementsService.createDuration() ]
    });
    fabContainer.close();
  }

  public entryChanged(): void {
    this.goalChanged();
  }

  public goalChanged(): void {
  }

  public saveGoalClicked(): void {
    this.viewController.dismiss({
      success: true,
      data: this.goal
    });
  }

  public dismissGoalClicked(): void {
    this.viewController.dismiss({
      success: false,
      data: this.goal
    });
  }
}
