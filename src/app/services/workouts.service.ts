import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';

import { by } from './utils';
import { DatabaseService } from './database.service';
import { ScoreCalculatorService } from './score-calculator.service';
import { DateFormatService } from './date-format.service';

import { Workout, Mood } from '../model';

@Injectable()
export class WorkoutsService {
  private workoutsDatabase: any;

  public constructor(
    private databaseService: DatabaseService,
    private translateService: TranslateService,
    private scoreCalculatorService: ScoreCalculatorService,
    private dateFormatService: DateFormatService
  ) {
    this.workoutsDatabase = databaseService.openDatabase('workouts');
  }

  public getWorkouts(): Observable<Workout[]> {
    return Observable.fromPromise(this.workoutsDatabase.allDocs({ include_docs: true }))
      .map((documents: any) => {
        return documents.rows.map((row) => row.doc).map((workout: Workout) => this.deserializeWorkout(workout))
          .sort(by<Workout>((workout) => -workout.createdAt.getTime()));
      });
  }

  public getWorkoutById(id: string): Observable<Workout> {
    return Observable.fromPromise(this.workoutsDatabase.get(id)).map((workout: Workout) => this.deserializeWorkout(workout));
  }

  public createWorkout(workout: Workout): Observable<Workout> {
    const transient = workout.transient;
    workout.transient = undefined;
    workout.updatedAt = workout.createdAt = new Date();
    return Observable.fromPromise(this.workoutsDatabase.post(workout)).map((result: any) => {
      if (result.ok) {
        workout._id = result.id;
        workout._rev = result.rev;
        workout.transient = transient;
        return workout;
      } else {
        throw new Error(`Error while creating workout ${JSON.stringify(workout)}`);
      }
    });
  }

  public updateWorkout(workout: Workout): Observable<Workout> {
    const transient = workout.transient;
    workout.transient = undefined;
    workout.updatedAt = new Date();
    return Observable.fromPromise(this.workoutsDatabase.put(workout)).map((result: any) => {
      if (result.ok) {
        workout._rev = result.rev;
        workout.transient = transient;
        return workout;
      } else {
        throw new Error(`Error while updating workout ${workout._id} ${JSON.stringify(workout)}`);
      }
    });
  }

  public deleteWorkout(workout: Workout): Observable<boolean> {
    const transient = workout.transient;
    workout.transient = undefined;
    return Observable.fromPromise(this.workoutsDatabase.remove(workout)).map((result: any) => {
      workout.transient = transient;
      return result.ok;
    });
  }

  public deserializeWorkout(workout: Workout): Workout {
    workout.createdAt = new Date(workout.createdAt);
    workout.updatedAt = new Date(workout.updatedAt);
    workout.start = workout.start ? new Date(workout.start) : new Date();
    workout.end = workout.end ? new Date(workout.end) : new Date();
    return workout;
  }
  
  public loadWorkout(workout: Workout): Workout {
    workout.transient = Object.assign(workout.transient || {}, {
      score: this.loadScore(workout),
      date: this.loadDate(workout),
      mood: this.loadMood(workout)
    });
    return workout;
  }
  
  private loadScore(workout: Workout): Observable<string> {
    return this.scoreCalculatorService.calculateScoreForWorkout(workout).switchMap((score) => {
      return this.translateService.get('workouts.workout-score.score', { score });
    });
  }

  private loadMood(workout: Workout): string {
    if (workout.sets.length === 0) {
      return 'neutral';
    }

    const moods = workout.sets.filter((set) => set.mood !== undefined).map((set) => set.mood);
    if (moods.length === 0) {
      return 'neutral';
    }

    const average = Math.round(moods.reduce((prev, cur) => prev + cur, 0) / moods.length);
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

  private loadDate(workout: Workout): Observable<string> {
    const start = workout.start;
    const end = workout.end;
    return Observable.forkJoin(
      this.dateFormatService.formatDay(start),
      this.dateFormatService.formatTime(start),
      this.dateFormatService.formatTime(end)
    ).switchMap((texts) => {
      const [ day, start1, end1 ] = texts;
      return this.translateService.get('workout-date', {
        day: day,
        start: start1,
        end: end1
      });
    });
  }
}
