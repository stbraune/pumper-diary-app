import { Goal } from './goal';

export interface Plan {
  id: number,
  title: string,
  description: string,
  goals: Goal[]
}
