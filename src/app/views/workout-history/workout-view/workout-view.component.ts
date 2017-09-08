import { Component } from '@angular/core';
import { NavParams, ModalController } from 'ionic-angular';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { Workout, Goal, Set, Mood, Exercise } from '../../../model';
import { ScoreCalculatorService, WorkoutsService, ToastService } from '../../../services';

import { WorkoutEditComponent } from '../workout-edit';

@Component({
  selector: 'workout-view',
  templateUrl: './workout-view.component.html'
})
export class WorkoutViewComponent {
  private workout: Workout;

  private items: Array<{
    goalIndex?: number,
    actionIndex?: number,
    goal?: string,
    set?: Set,
    exercise: Exercise,
    mood?: string,
    score: Observable<number> | ReplaySubject<number>
    sets?: Array<{
      set: Set,
      mood: string,
      score: Observable<number>
    }>
  }> = [];

  public constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private toastService: ToastService,
    private scoreCalculatorService: ScoreCalculatorService,
    private workoutsService: WorkoutsService
  ) {
    this.workout = this.navParams.get('workout');
    this.loadItems();
  }

  private loadItems() {
    this.items = [];
    let goalIndex = -1;
    let actionIndex = -1;
    let uniqueGoals = [];
    this.workout.sets = this.workout.sets || [];
    for (let i = 0; i < this.workout.sets.length; i++) {
      const set = this.workout.sets[i];
      if (set.goalId && uniqueGoals.indexOf(set.goalId) == -1) {
        // planned set
        actionIndex = -1;
        goalIndex++;
        uniqueGoals.push(set.goalId);
      } else if (!set.goalId) {
        // freestyle set
        goalIndex++;
      }
      
      actionIndex++;

      if (set.goalId) {
        let goalItem = this.items.find((item) => item.goal === set.goalId);
        if (!goalItem) {
          goalItem = {
            goalIndex,
            actionIndex,
            goal: set.goalId,
            exercise: set.exercise,
            sets: [],
            score: new ReplaySubject<number>()
          };
          this.items.push(goalItem);
        }

        goalItem.sets.push({
          set,
          mood: this.workoutsService.convertMood(set.mood),
          score: this.scoreCalculatorService.calculateScoreForSet(set)
        });

        Observable.forkJoin(goalItem.sets.map((child) => this.scoreCalculatorService.calculateScoreForSet(child.set)))
          .subscribe((scores) => {
            const score = scores.reduce((prev, cur) => prev + cur, 0);
            if (<ReplaySubject<number>>goalItem.score) {
              (<ReplaySubject<number>>goalItem.score).next(score);
            }
          });
      } else {
        this.items.push({
          goalIndex,
          actionIndex,
          set,
          exercise: set.exercise,
          mood: this.workoutsService.convertMood(set.mood),
          score: this.scoreCalculatorService.calculateScoreForSet(set)
        });
      }
    }
  }
  
  public editWorkoutClicked() {
    const transient = this.workout.transient;
    this.workout.transient = undefined;
    const copy = this.workoutsService.deserializeWorkout(JSON.parse(JSON.stringify(this.workout)));
    this.workout.transient = transient;

    let workoutEditModal = this.modalController.create(WorkoutEditComponent, {
      data: copy
    });

    workoutEditModal.onDidDismiss((result) => {
      if (!result) {
        return;
      }

      if (result.success) {
        this.updateWorkout(result.data);
      }
    });
    workoutEditModal.present();
  }
  
  private updateWorkout(workout: Workout): void {
    this.workoutsService.putWorkout(workout).subscribe((result) => {
      this.workout = this.workoutsService.loadWorkout(workout);
      this.loadItems();
      this.toastService.showSuccessToast('save-workout-succeeded', result);
    }, (error) => {
      this.toastService.showErrorToast('save-workout-failed', error);
    });
  }
}
