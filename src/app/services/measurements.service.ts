import { Injectable } from '@angular/core';

import {
  Measure,
  Measurement
} from '../model';

@Injectable()
export class MeasurementsService {
  public createMeasurement(measure: Measure): Measurement {
    switch (measure) {
      case Measure.Calories:
        return this.createCalories();
      case Measure.Distance:
        return this.createDistance();
      case Measure.Duration:
        return this.createDuration();
      case Measure.Repetitions:
        return this.createRepetitions();
      case Measure.Weight:
        return this.createWeight();
      default:
        throw new Error('Unsupported measure: ' + measure);
    }
  }

  public createCalories(): Measurement {
    return {
      measure: Measure.Calories,
      value: '0'
    };
  }

  public createDistance(): Measurement {
    return {
      measure: Measure.Distance,
      value: '0',
      unit: 'm'
    };
  }

  public createDuration(): Measurement {
    return {
      measure: Measure.Duration,
      value: '00:00:00'
    };
  }

  public createRepetitions(): Measurement {
    return {
      measure: Measure.Repetitions,
      value: '0'
    };
  }

  public createWeight(): Measurement {
    return {
      measure: Measure.Weight,
      value: '0',
      unit: 'kgs'
    };
  }
}
