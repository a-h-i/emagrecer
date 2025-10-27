import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UnitEnum } from './UnitEnum';
import { RecipeIngredientSchemaType } from './schemas';
import type { Recipe } from './Recipe';
import { Ingredient } from './Ingredient';

@Entity({
  name: 'recipe_ingredient',
})
export class RecipeIngredient {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  recipe_id!: string;

  @Column({ type: 'uuid' })
  ingredient_id!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  quantity!: string;

  @Column({ type: 'enum', enum: UnitEnum, default: UnitEnum.GRAM })
  unit!: UnitEnum;

  /**
   * grams per unit (e.g., 1 piece = 60g)
   */
  @Column({ type: 'numeric', precision: 10, scale: 6, default: 1 })
  unit_to_g!: string;

  @Column({ type: 'text', default: '' })
  note!: string;

  @Column({ type: 'timestamp', default: () => 'now()' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'now()' })
  updated_at!: Date;

  @ManyToOne('Ingredient')
  @JoinColumn({
    name: 'ingredient_id',
    referencedColumnName: 'id',
  })
  ingredient!: Promise<Ingredient>;

  @ManyToOne('Recipe')
  @JoinColumn({
    name: 'recipe_id',
    referencedColumnName: 'id',
  })
  recipe!: Promise<Recipe>;

  serialize(): RecipeIngredientSchemaType {
    return {
      id: this.id,
      recipe_id: this.recipe_id,
      ingredient_id: this.ingredient_id,
      quantity: parseFloat(this.quantity),
      unit: this.unit,
      unit_to_g: parseFloat(this.unit_to_g),
      note: this.note,
      created_at: this.created_at.toISOString(),
      updated_at: this.updated_at.toISOString(),
    };
  }
}
