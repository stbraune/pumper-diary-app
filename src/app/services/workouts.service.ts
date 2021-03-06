import { Injectable, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { DatabaseService } from './database.service';
import { Database } from './database';

import { ScoreCalculatorService } from './score-calculator.service';
import { DateFormatService } from './date-format.service';

import { Workout, Mood } from '../model';

@Injectable()
export class WorkoutsService {
  private workoutsDatabase: Database<Workout>;

  public workoutSaved = new EventEmitter<Workout>();
  public workoutRemoved = new EventEmitter<Workout>();

  public constructor(
    private databaseService: DatabaseService,
    private translateService: TranslateService,
    private scoreCalculatorService: ScoreCalculatorService,
    private dateFormatService: DateFormatService
  ) {
    this.workoutsDatabase = databaseService.openDatabase<Workout>('workout',
      (workout) => this.deserializeWorkout(workout));
    this.workoutsDatabase.entitySaved.subscribe((workout: Workout) => this.workoutSaved.emit(workout));
    this.workoutsDatabase.entityRemoved.subscribe((workout: Workout) => this.workoutRemoved.emit(workout));
  }

  public getWorkouts(): Observable<Workout[]> {
    return this.workoutsDatabase.getEntities({
      descending: true
    });
  }

  public getWorkoutById(id: string): Observable<Workout> {
    return this.workoutsDatabase.getEntityById(id);
  }

  public postWorkout(workout: Workout): Observable<Workout> {
    return this.workoutsDatabase.postEntity(workout);
  }

  public putWorkout(workout: Workout): Observable<Workout> {
    return this.workoutsDatabase.putEntity(workout);
  }

  public removeWorkout(workout: Workout): Observable<boolean> {
    return this.workoutsDatabase.removeEntity(workout);
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
      dateShort: this.dateFormatService.formatDateShort(workout.start),
      duration: this.dateFormatService.formatDuration(workout.start, workout.end),
      mood: this.loadMood(workout)
    });
    return workout;
  }
  
  private loadScore(workout: Workout): Observable<string> {
    return this.scoreCalculatorService.calculateScoreForWorkout(workout).switchMap((score) => {
      return this.translateService.get('workouts.workout-score.score', { score });
    });
  }

  public loadMood(workout: Workout): string {
    if (workout.sets.length === 0) {
      return 'neutral';
    }

    const moods = workout.sets.filter((set) => set.mood !== undefined).map((set) => set.mood);
    if (moods.length === 0) {
      return 'neutral';
    }

    return this.convertMood(Math.round(moods.reduce((prev, cur) => prev + cur, 0) / moods.length));
  }

  public convertMood(mood: Mood): string {
    if (mood === undefined || mood === null) {
      return 'unknown';
    }

    switch (mood) {
      case Mood.Happy:
        return 'happy';
      case Mood.Neutral:
        return 'neutral';
      case Mood.Unhappy:
        return 'unhappy';
      default:
        return 'unknown';
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
