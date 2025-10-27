import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UnitEnum } from './UnitEnum';
import type { NutritionInfo } from './NutritionInfo';
import { Allergens } from './Allergens';
import { IngredientSchemaType } from './schemas';

@Entity({
  name: 'ingredient',
})
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  name_en!: string;
  @Column({
    type: 'text',
    nullable: false,
  })
  name_pt!: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  aisle_slug!: string;

  @Column({ type: 'enum', enum: UnitEnum, default: UnitEnum.GRAM })
  unit_base!: UnitEnum;

  @Column({ type: 'numeric', precision: 10, scale: 6, nullable: true })
  density_g_per_ml!: string | null;

  @Column({
    type: 'jsonb',
    nullable: false,
  })
  nutrition_per_100g!: NutritionInfo;

  @Column({
    type: 'enum',
    enum: Allergens,
    array: true,
    default: [],
  })
  allergens!: Allergens[];

  @Column({
    default: true,
    type: 'boolean',
  })
  is_active!: boolean;

  @Column({ type: 'timestamp', default: () => 'now()' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'now()' })
  updated_at!: Date;

  serialize(): IngredientSchemaType {
    return {
      id: this.id,
      name_en: this.name_en,
      name_pt: this.name_pt,
      aisle_slug: this.aisle_slug,
      unit_base: this.unit_base,
      density_g_per_ml: this.density_g_per_ml,
      nutrition_per_100g: this.nutrition_per_100g,
      allergens: this.allergens,
      is_active: this.is_active,
      created_at: this.created_at.toISOString(),
      updated_at: this.updated_at.toISOString(),
    };
  }
}
