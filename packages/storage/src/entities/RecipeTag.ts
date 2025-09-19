import { Column, Entity, ManyToMany } from 'typeorm';
import { RecipeTagSchemaType } from './schemas';
import { Recipe } from './Recipe';

@Entity('recipe_tag')
export class RecipeTag {
  @Column({ type: 'text', primary: true })
  slug!: string;

  @Column({ type: 'text' })
  slug_en!: string;
  @Column({ type: 'text' })
  slug_pt!: string;

  @ManyToMany('Recipe')
  recipes!: Promise<Recipe[]>;

  serialize(): RecipeTagSchemaType {
    return {
      slug: this.slug,
      slug_pt: this.slug_pt,
      slug_en: this.slug_en,
    };
  }
}
