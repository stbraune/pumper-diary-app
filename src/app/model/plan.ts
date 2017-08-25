import { Goal } from './goal';

export interface Plan {
  _id?: string;
  _rev?: string;
  title: string;
  description: string;
  goals: Goal[];
  createdAt?: Date;
  updatedAt?: Date;
}
