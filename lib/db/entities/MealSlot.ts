import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { MealType } from '@/lib/db/entities/MealType';

@Entity({
  name: 'meal_slot',
})
export class MealSlot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  plan_id!: string;

  /**
   * 0-6
   */
  @Column({ type: 'int' })
  day!: number;

  @Column({ type: 'enum', enum: MealType })
  meal!: MealType;

  @Column({ type: 'uuid' })
  recipe_id!: string;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 1 })
  servings!: string;

  @Column({ type: 'timestamp', default: () => 'now()' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'now()' })
  updated_at!: Date;
}
