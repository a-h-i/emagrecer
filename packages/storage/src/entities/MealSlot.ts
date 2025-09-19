import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { MealType } from './MealType';
import { Recipe } from './Recipe';
import { MealSlotSchemaType } from './schemas';

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

  @Column({ type: 'double precision', default: 1 })
  servings!: number;

  @Column({ type: 'timestamp', default: () => 'now()' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'now()' })
  updated_at!: Date;

  @OneToOne('Recipe')
  @JoinColumn({
    name: 'recipe_id',
    referencedColumnName: 'id',
  })
  recipe!: Promise<Recipe>;

  serialize(): MealSlotSchemaType {
    return {
      id: this.id,
      plan_id: this.plan_id,
      day: this.day,
      meal: this.meal,
      recipe_id: this.recipe_id,
      servings: this.servings,
      created_at: this.created_at.toISOString(),
      updated_at: this.updated_at.toISOString(),
    };
  }
}
