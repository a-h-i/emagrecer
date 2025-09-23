import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { RecipeSchemaType } from './schemas';
import type { RecipeTag } from './RecipeTag';
import type { Ingredient } from './Ingredient';
import type { RecipeIngredient } from './RecipeIngredient';

@Entity({
  name: 'recipe',
})
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'text',
  })
  title_en!: string;

  @Column({
    type: 'text',
  })
  title_pt!: string;

  @Column({ type: 'double precision', default: 1 })
  servings!: number;

  @Column({ type: 'tsvector' })
  instructions_md_en!: string;
  @Column({ type: 'text' })
  instructions_md_pt!: string;

  @Column({
    type: 'tsvector',
    generatedType: 'STORED',
  })
  text_searchable_en!: string;

  @Column({
    type: 'tsvector',
    generatedType: 'STORED',
  })
  text_searchable_pt!: string;

  @Column({ type: 'numeric', precision: 6, scale: 2 })
  kcal_per_serving!: string;

  @Column({ type: 'numeric', precision: 6, scale: 2 })
  protein_g_per_serving!: string;

  @Column({ type: 'numeric', precision: 6, scale: 2 })
  carbs_g_per_serving!: string;
  @Column({ type: 'numeric', precision: 6, scale: 2 })
  fat_g_per_serving!: string;

  @Column({ type: 'uuid', nullable: true })
  created_by_user_id!: string | null;

  @Column({ type: 'int' })
  estimated_cook_time_s!: number;

  @Column({ type: 'timestamp', default: () => 'now()' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'now()' })
  updated_at!: Date;

  @ManyToMany('RecipeTag')
  @JoinTable({
    name: 'recipe_tag_relation',
    joinColumn: {
      name: 'recipe_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag',
      referencedColumnName: 'slug',
    },
    synchronize: false,
  })
  tags!: Promise<RecipeTag[]>;

  @ManyToMany('Ingredient')
  @JoinTable({
    name: 'recipe_ingredient',
    joinColumn: {
      name: 'recipe_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'ingredient_id',
      referencedColumnName: 'id',
    },

    synchronize: false,
  })
  ingredients!: Promise<Ingredient[]>;

  @OneToMany(
    'RecipeIngredient',
    (recipeIngredient: RecipeIngredient) => recipeIngredient.recipe,
  )
  @JoinColumn({
    name: 'recipe_id',
    referencedColumnName: 'id',
  })
  recipe_ingredients!: Promise<RecipeIngredient[]>;

  serialize(): RecipeSchemaType {
    return {
      id: this.id,
      title_en: this.title_en,
      title_pt: this.title_pt,
      servings: this.servings,
      instructions_md_en: this.instructions_md_en,
      instructions_md_pt: this.instructions_md_pt,
      kcal_per_serving: parseFloat(this.kcal_per_serving),
      protein_g_per_serving: parseFloat(this.protein_g_per_serving),
      carbs_g_per_serving: parseFloat(this.carbs_g_per_serving),
      fat_g_per_serving: parseFloat(this.carbs_g_per_serving),
      estimated_cook_time_s: this.estimated_cook_time_s,
      created_by_user_id: this.created_by_user_id,
      created_at: this.created_at.toISOString(),
      updated_at: this.updated_at.toISOString(),
    };
  }
}
