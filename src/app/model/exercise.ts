import { Entity } from './entity';
import { Measure } from './measure';

export interface Exercise extends Entity {
  title: string;
  description: string;
  difficulty: number;
  measures: Measure[];
  tags: string[];
}
