import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAisle1755992317179 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE aisle
      (
        slug           text PRIMARY KEY,
        name_en        text        NOT NULL,
        name_pt        text        NOT NULL,
        description_en text        not null,
        description_pt text        not null,
        icon_key       text        not null,
        is_active      boolean     not null default true,
        created_at     timestamptz NOT NULL DEFAULT now(),
        updated_at     timestamptz NOT NULL DEFAULT now()
      );

      create trigger aisle_set_updated_at
        before update
        on aisle
        for each row
      execute procedure set_updated_at();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE aisle cascade;
      `);
  }
}
