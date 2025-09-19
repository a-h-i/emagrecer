import { Column, Entity } from 'typeorm';
import { RecipeTagsRelationSchemaType } from './schemas';

@Entity('recipe_tags_relation')
export class RecipeTagsRelation {
  @Column({ type: 'text', primary: true })
  tag!: string;
  @Column({ type: 'uuid', primary: true })
  recipe_id!: string;

  serialize(): RecipeTagsRelationSchemaType {
    return {
      tag: this.tag,
      recipe_id: this.recipe_id,
    };
  }
}
