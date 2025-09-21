import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateComputeRecipeTotalsFunc1756077439079
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create or replace function compute_recipe_totals(recipe_id uuid) returns void as $$
      declare kcal numeric := 0; protein numeric := 0; carbs numeric := 0; fat numeric := 0;
      begin
        with items as (
          select 
          ri.quantity * ri.unit_to_g as grams,
          i.nutrition_per_100g as nutr_per_100g
          from recipe_ingredient ri join ingredient i on ri.ingredient_id = i.id
          where ri.recipe_id = compute_recipe_totals.recipe_id
        ) 
        select 
          coalesce(sum( (nutr_per_100g->>'kcal')::numeric * grams / 100), 0),
          coalesce(sum( (nutr_per_100g->>'protein_g')::numeric * grams / 100), 0),
          coalesce(sum( (nutr_per_100g->>'carbs_g')::numeric * grams / 100), 0),
          coalesce(sum( (nutr_per_100g->>'fat_g')::numeric * grams / 100), 0)
        into kcal, protein, carbs, fat from items;
        
        update recipe set
          kcal_per_serving = round(kcal / greatest(servings, 1)::numeric, 2),
          protein_g_per_serving = round((protein / greatest(servings, 1))::numeric, 2),
          carbs_g_per_serving = round((carbs / greatest(servings, 1))::numeric, 2),
          fat_g_per_serving = round((fat / greatest(servings, 1)::numeric), 2)
        where id = compute_recipe_totals.recipe_id;
      end $$ language plpgsql;
          
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop function compute_recipe_totals(uuid);
      `);
  }
}
