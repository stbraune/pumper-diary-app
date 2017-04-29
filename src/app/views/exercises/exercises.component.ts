import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Exercise } from '../../model/exercise';

import { ExercisesService } from '../../services/exercises.service';

import { ExerciseAddComponent } from './exercise-add';
import { ExerciseEditComponent } from './exercise-edit';

@Component({
  selector: 'exercises',
  templateUrl: './exercises.component.html'
})
export class ExercisesComponent { 
  public constructor(
    private exercisesService: ExercisesService,
    public navController: NavController
  ) {
  }

  public getExercises() {
    return this.exercisesService.getExercises();
  }

  public exerciseSelected(exercise: Exercise): void {
    this.navController.push(ExerciseEditComponent, {
      data: exercise
    });
  }

  public addExerciseClicked($event: any): void {
    this.navController.push(ExerciseAddComponent);
  }
}
