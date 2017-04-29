import { Measure } from './measure';

export interface Exercise {
  id: number,
  title: string,
  description: string,
  difficulty: number,
  measures: Measure[]
}
