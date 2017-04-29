import { Component } from '@angular/core';

import { NavParams, ViewController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';

import {
  Goal,
  Entry,
  EntryType,
  Exercise
} from '../../../model';

import {
  ExercisesService
} from '../../../services';

@Component({
  selector: 'goal-edit',
  templateUrl: './goal-edit.component.html'
})
export class GoalEditComponent {
  private goal: Goal;

  public date: string = '';

  public constructor(
    private navParams: NavParams,
    private viewController: ViewController,
    private exercisesService: ExercisesService
  ) {
    this.goal = navParams.get('data');
  }

  public getExercises(): Observable<Exercise[]> {
    return this.exercisesService.getExercises();
  }

  public isPause(entry: Entry): boolean {
    return entry.type === EntryType.Pause;
  }

  public isAction(entry: Entry): boolean {
    return entry.type === EntryType.Action;
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
