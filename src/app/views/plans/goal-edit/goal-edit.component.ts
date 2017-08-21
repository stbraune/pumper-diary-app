import {
  Component,
  OnInit
} from '@angular/core';

import {
  FabContainer,
  NavParams,
  PopoverController,
  ToastController,
  ViewController
} from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

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
  MeasurementsService
} from '../../../services';

import {
  EntryPopoverMenuComponent
} from '../entry-popover-menu';

@Component({
  selector: 'goal-edit',
  templateUrl: './goal-edit.component.html'
})
export class GoalEditComponent implements OnInit {
  private goal: Goal;
  private exercise: number;

  public constructor(
    private translateService: TranslateService,
    private navParams: NavParams,
    private popoverController: PopoverController,
    private toastController: ToastController,
    private viewController: ViewController,
    private exercisesService: ExercisesService,
    private measurementsService: MeasurementsService
  ) {
    this.goal = this.navParams.get('data');
  }

  public ngOnInit(): void {
    this.exercise = this.goal.exercise ? this.goal.exercise.id : 0;
  }

  public exerciseSelected(): void {
    this.exercisesService.getExerciseById(this.exercise).subscribe((exercise) => {
      console.log('selected: ' + JSON.stringify(exercise));
      this.goal.exercise = exercise;
    }, (error) => {
      Observable.forkJoin(
        this.translateService.get('set-exercise-failed'),
        this.translateService.get('close')
      ).subscribe((texts) => {
        this.toastController.create({
          message: texts[0],
          showCloseButton: true,
          closeButtonText: texts[1]
        }).present();
      });
    });
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
    if (!this.goal.exercise) {
      Observable.forkJoin(
        this.translateService.get('no-exercise-selected'),
        this.translateService.get('close')
      ).subscribe((texts) => {
        this.toastController.create({
          message: texts[0],
          duration: 3000,
          closeButtonText: texts[1]
        }).present();
      });
      return;
    }

    this.exercisesService.getExerciseById(this.goal.exercise.id).subscribe((exercise) => {
      this.goal.entries.push({
        type: EntryType.Action,
        measurements: exercise.measures.map((measure) => this.measurementsService.createMeasurement(measure))
      });
      fabContainer.close();
    }, (error) => {
      Observable.forkJoin(
        this.translateService.get('add-action-failed'),
        this.translateService.get('close')
      ).subscribe((texts) => {
        this.toastController.create({
          message: texts[0],
          showCloseButton: true,
          closeButtonText: texts[1]
        }).present();
      });
    });
  }

  public addPauseClicked($event: any, fabContainer: FabContainer): void {
    if (!this.goal.exercise) {
      Observable.forkJoin(
        this.translateService.get('no-exercise-selected'),
        this.translateService.get('close')
      ).subscribe((texts) => {
        this.toastController.create({
          message: texts[0],
          duration: 3000,
          closeButtonText: texts[1]
        }).present();
      });
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
