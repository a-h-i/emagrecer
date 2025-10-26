import { EntityManager } from 'typeorm';
import { RecipeTag } from '../entities';

export default async function createRecipeTags(
  manager: EntityManager,
): Promise<RecipeTag[]> {
  const tags = [
    manager.create(RecipeTag, {
      slug: 'high-protein',
      slug_en: 'high-protein',
      slug_pt: 'alta-proteina',
    }),
    manager.create(RecipeTag, {
      slug: 'quick',
      slug_en: 'quick',
      slug_pt: 'rapido',
    }),
    manager.create(RecipeTag, {
      slug: 'vegetarian',
      slug_en: 'vegetarian',
      slug_pt: 'vegetariano',
    }),
  ];
  await manager.save(tags);
  return tags;
}
