import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {
  EntryType,
  Measure,
  Set
} from '../model';

import {
  UnitConverterService
} from './unit-converter.service';

import { ExercisesService } from './exercises.service';

@Injectable()
export class ScoreCalculatorService {
  public constructor(
    private unitConverterService: UnitConverterService,
    private exercisesService: ExercisesService
  ) { }
  
  public calculateScore(set: Set): Observable<number> {
    let totals = {
      calories: 0,
      distance: 0,
      duration: 0,
      repetitions: 0,
      weight: 0
    };

    for (let measurement of set.measurements) {
      switch (measurement.measure) {
        case Measure.Calories:
          totals.calories += parseFloat(measurement.value);
          break;
        case Measure.Distance:
          totals.distance += this.unitConverterService.convert(parseFloat(measurement.value))
            .from(measurement.unit)
            .to(UnitConverterService.units.km);
          break;
        case Measure.Duration:
          totals.duration += parseFloat(measurement.value);
          break;
        case Measure.Repetitions:
          totals.repetitions += parseFloat(measurement.value);
          break;
        case Measure.Weight:
          totals.weight += this.unitConverterService.convert(parseFloat(measurement.value))
            .from(measurement.unit)
            .to(UnitConverterService.units.kg);
          break;
        default:
          throw new Error('Unsupported measure: ' + JSON.stringify(measurement));
      }
    }

    let score = 0;
    if (totals.repetitions > 0 && totals.weight > 0) {
      score += totals.repetitions * totals.weight;
    } else if (totals.repetitions + totals.weight > 0) {
      // Only one of these two measurements is greater than 0, so simply add them
      // (zero and the other) and save another if.
      score += totals.repetitions + totals.weight;
    } else if (totals.distance == 0) {
      // Use duration in calculation only if no weight, repetitions or distance was measured.
      score += totals.duration * set.goal.entries.filter((e) => e.type === EntryType.Action).length;
    }

    score += totals.distance;
    score += totals.calories;

    return this.exercisesService.getExerciseById(set.goal.exercise.id).map((exercise) => {
      return score * exercise.difficulty;
    });
  }
}
