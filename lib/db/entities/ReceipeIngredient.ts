import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UnitEnum } from '@/lib/db/entities/UnitEnum';

@Entity()
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

  @Column({ type: 'timestamp', default: () => "now()"})
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => "now()"})
  updated_at!: Date;
}
