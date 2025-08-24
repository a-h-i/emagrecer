import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRecipe1755993148327 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE recipe
        (
          id                    uuid PRIMARY KEY       DEFAULT gen_random_uuid(),
          title_en              text          NOT NULL,
          title_pt              text          NOT NULL,
          slug                  text          not null,
          servings              int           not null default 2,
          instructions_md_en    text,
          instructions_md_pt    text,
          tags                  text[]        not null default '{}',
          kcal_per_serving      int           not null,
          protein_g_per_serving numeric(6, 2) not null,
          carbs_g_per_serving   numeric(6, 2) not null,
          fat_g_per_serving     numeric(6, 2) not null,
          created_by_user_id    uuid references users (id) on delete set null on update cascade,
          created_at            timestamptz   NOT NULL DEFAULT now(),
          updated_at            timestamptz   NOT NULL DEFAULT now()
        );
        create trigger recipe_set_updated_at
          before update
          on recipe
          for each row
        execute procedure set_updated_at();
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE recipe cascade;
      `);
  }
}
