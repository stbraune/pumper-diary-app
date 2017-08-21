import { Measure } from './measure';

export interface Exercise {
  _id?: string;
  _rev?: string;
  title: string;
  description: string;
  difficulty: number;
  measures: Measure[];
}
