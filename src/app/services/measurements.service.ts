import { Injectable } from '@angular/core';

import {
  Measure,
  Measurement
} from '../model';

import {
  UnitConverterService
} from './unit-converter.service';

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

  public createCalories(value: string = '0'): Measurement {
    return {
      measure: Measure.Calories,
      value
    };
  }

  public createDistance(value: string = '0'): Measurement {
    return {
      measure: Measure.Distance,
      value,
      unit: UnitConverterService.units.km
    };
  }

  public createDuration(value: string = '00:00:00'): Measurement {
    return {
      measure: Measure.Duration,
      value
    };
  }

  public createRepetitions(value: string = '0'): Measurement {
    return {
      measure: Measure.Repetitions,
      value
    };
  }

  public createWeight(value: string = '0'): Measurement {
    return {
      measure: Measure.Weight,
      value,
      unit: UnitConverterService.units.kg
    };
  }
}
