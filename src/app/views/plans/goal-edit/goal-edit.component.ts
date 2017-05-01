import { Component } from '@angular/core';

import {
  FabContainer,
  NavParams,
  PopoverController,
  ViewController
} from 'ionic-angular';

import { Observable } from 'rxjs/Observable';

import {
  Goal,
  Entry,
  EntryType,
  Exercise
} from '../../../model';

import {
  ExercisesService,
  MeasurementsService
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

  public date: string = '';

  public m = this.measurementsService.createWeight();

  public constructor(
    private navParams: NavParams,
    private popoverController: PopoverController,
    private viewController: ViewController,
    private exercisesService: ExercisesService,
    private measurementsService: MeasurementsService
  ) {
    this.goal = navParams.get('data');
  }

  public getExercises(): Observable<Exercise[]> {
    return this.exercisesService.getExercises();
  }

  public reorderEntries($event: any) {
    let entry = this.goal.entries[$event.from];
    this.goal.entries.splice($event.from, 1);
    this.goal.entries.splice($event.to, 0, entry);
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
    console.log('add action');
    this.goal.entries.push({
      type: EntryType.Action,
      measurements: this.goal.exercise.measures.map((measure) => this.measurementsService.createMeasurement(measure))
    });
    fabContainer.close();
  }

  public addPauseClicked($event: any, fabContainer: FabContainer): void {
    console.log('add pause');
    this.goal.entries.push({
      type: EntryType.Pause,
      measurements: [ this.measurementsService.createDuration() ]
    });
    fabContainer.close();
  }

  public entryChanged(): void {
    console.log('entry changed');
    this.goalChanged();
  }

  public goalChanged(): void {
    console.log('goal changed');
  }

  public dismissModal(): void {
    this.viewController.dismiss({
      data: this.goal
    });
  }
}
