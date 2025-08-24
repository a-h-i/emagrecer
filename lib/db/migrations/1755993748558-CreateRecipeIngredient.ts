import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRecipeIngredient1755993748558 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        CREATE TABLE recipe_ingredient
        (
          id            uuid primary key        default gen_random_uuid(),
          recipe_id     uuid           not null references recipe (id) on delete cascade on update cascade,
          ingredient_id uuid           not null references ingredient (id) on delete cascade on update cascade,
          quantity      numeric(10, 2) not null,
          unit          unit_enum      not null,
          unit_to_g     numeric(10, 6) not null,
          note          text           not null default '',
          created_at    timestamptz    NOT NULL DEFAULT now(),
          updated_at    timestamptz    NOT NULL DEFAULT now(),
          constraint recipe_ingredient_unique unique (recipe_id, ingredient_id, note)
        );
        create trigger recipe_ingredient_set_updated_at
          before update
          on recipe_ingredient
          for each row
          execute procedure set_updated_at();
      `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        DROP TABLE recipe_ingredient cascade;
      `)
    }

}
