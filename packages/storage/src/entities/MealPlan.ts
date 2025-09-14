import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { MacroSplit } from './MacroSplit';

@Entity()
export class MealPlan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'timestamp' })
  week_start!: Date;

  @Column({ type: 'int', nullable: true })
  kcal_target!: number | null;

  @Column({ type: 'jsonb', nullable: true })
  macro_split!: MacroSplit | null;

  @Column({ type: 'timestamp', default: () => 'now()' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'now()' })
  updated_at!: Date;


  serialize() {
    return {
      id: this.id,
      user_id: this.user_id,
      week_start: this.week_start.toISOString(),
      kcal_target: this.kcal_target,
      macro_split: this.macro_split,
      created_at: this.created_at.toISOString(),
      updated_at: this.updated_at.toISOString(),
    };
  }
}
