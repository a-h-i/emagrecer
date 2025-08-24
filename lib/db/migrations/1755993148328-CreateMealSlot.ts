import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMealSlot1755993148328 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE meal_slot
        (
          id         uuid PRIMARY KEY        DEFAULT gen_random_uuid(),
          plan_id    uuid           not null references meal_plan (id) on delete cascade on update cascade,
          day        int            not null,
          meal       meal_type_enum not null,
          recipe_id  uuid           not null references recipe (id) on delete restrict on update cascade,
          servings   numeric(5, 2)  not null default 1,
          created_at timestamptz    NOT NULL DEFAULT now(),
          updated_at timestamptz    NOT NULL DEFAULT now(),
          constraint meal_day_range check (day >= 0 and day <= 6),
          constraint meal_slot_unique unique (plan_id, day, meal)
        );
        create trigger meal_slot_set_updated_at
          before update
          on meal_slot
          for each row
        execute procedure set_updated_at();
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE meal_slot cascade;
      `);
  }
}
