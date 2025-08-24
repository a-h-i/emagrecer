import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIngredient1755992470544 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE ingredient
        (
          id                 uuid PRIMARY KEY     DEFAULT gen_random_uuid(),
          name_en            text        NOT NULL,
          name_pt            text        NOT NULL,
          aisle_slug         text        not null references aisle (slug) on delete cascade on update cascade,
          unit_base          unit_enum   not null,
          allergens          allergen_enum[] not null default '{}',
          density_g_per_ml   numeric(10, 6),
          nutrition_per_100g jsonb       not null,
          is_active          boolean     not null default true,
          created_at         timestamptz NOT NULL DEFAULT now(),
          updated_at         timestamptz NOT NULL DEFAULT now()
        );
        create trigger ingredient_set_updated_at
          before update
          on ingredient
          for each row
          execute procedure set_updated_at();
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE ingredient cascade;
      `);
  }
}
