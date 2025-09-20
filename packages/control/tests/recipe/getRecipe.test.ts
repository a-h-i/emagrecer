import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { DataSource, EntityNotFoundError } from 'typeorm';
import {
  createPgDataSource,
  Recipe,
  RecipeTag,
  RecipeTagsRelation,
} from '@emagrecer/storage';
import { getRecipe } from '../../src';
import { faker } from '@faker-js/faker';


describe('getRecipe', () => {

  let source: DataSource;

  beforeAll(async () => {
    source = createPgDataSource(true);
    await source.initialize();
  });

  afterAll(async () => {
    await source.manager.query(
      `
      truncate recipe cascade;
      truncate recipe_tag cascade;
      `,
    );
    await source.destroy();
  });

  it('fails on non-existing recipe', async () => {
    await expect(getRecipe(source.manager, faker.string.uuid())).rejects.toThrow(EntityNotFoundError);
  });

  it('fetches an existing recipe', async () => {
    const tag = source.manager.create(RecipeTag, {
      slug: 'vegetarian',
      slug_en: 'vegetarian',
      slug_pt: 'vegetariano',
    });
    await source.manager.save(tag);
    const recipe = source.manager.create(Recipe, {
      title_en: faker.lorem.sentence(),
      title_pt: faker.lorem.sentence(),
      slug: faker.lorem.slug(),
      servings: 2,
      instructions_md_en: faker.lorem.paragraph(),
      instructions_md_pt: faker.lorem.paragraph(),
      kcal_per_serving: 100,
      protein_g_per_serving: 10,
      carbs_g_per_serving: 5,
      fat_g_per_serving: 2,
      description: faker.lorem.paragraph(),
      estimated_cook_time_s: 60 * 30,
    });
    await source.manager.save(recipe);
    const relation = source.manager.create(RecipeTagsRelation, {
      tag: tag.slug,
      recipe_id: recipe.id,
    });
    await source.manager.save(relation);

    // TODO: Add ingredients and ensure recipe macros are calculated correctly

    const fetched = await getRecipe(source.manager, recipe.id);
    expect(fetched.tags).resolves.toStrictEqual([tag]);

  });
})