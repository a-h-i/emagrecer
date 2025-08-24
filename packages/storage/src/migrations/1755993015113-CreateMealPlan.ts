import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMealPlan1755993015113 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE meal_plan
        (
          id          uuid PRIMARY KEY     DEFAULT gen_random_uuid(),
          user_id     uuid        not null references users (id) on delete cascade on update cascade,
          week_start  date        not null,
          kcal_target int,
          macro_split jsonb,
          created_at  timestamptz NOT NULL DEFAULT now(),
          updated_at  timestamptz NOT NULL DEFAULT now(),
          constraint meal_plan_unique unique (user_id, week_start)
        );
        create trigger meal_plan_set_updated_at
          before update
          on meal_plan
          for each row
        execute procedure set_updated_at();
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE meal_plan cascade;
      `);
  }
}
