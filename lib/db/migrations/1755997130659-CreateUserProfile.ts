import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserProfile1755997130659 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE user_profile
        (
          user_id uuid PRIMARY KEY references users (id) on delete cascade on update cascade,
          diet_preference diet_preference_enum not null,
          allergens allergen_enum[] not null default '{}',
          kcal_target int,
          macro_split jsonb,
          height_cm int,
          weight_kg int,
          default_store_slug text references store (slug) on delete set null on update cascade,
          created_at timestamptz NOT NULL DEFAULT now(),
          updated_at timestamptz NOT NULL DEFAULT now()
        );
        create trigger user_profile_set_updated_at
          before update
          on user_profile
          for each row
          execute procedure set_updated_at();
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE user_profile cascade;
      `);
  }
}
