import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProduct1755992831208 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE product
        (
          id             uuid PRIMARY KEY        DEFAULT gen_random_uuid(),
          store_slug     text           not null references store (slug) on delete cascade on update cascade,
          ingredient_id  uuid           not null references ingredient (id) on delete cascade on update cascade,
          brand          text,
          label          text           not null,
          size_g         numeric(10, 2) not null,
          unit_price_eur numeric(10, 2) not null,
          is_active      boolean        not null default true,
          created_at     timestamptz    NOT NULL DEFAULT now(),
          updated_at     timestamptz    NOT NULL DEFAULT now()
        );
        create trigger product_set_updated_at
          before update
          on product
          for each row
        execute procedure set_updated_at();
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE product cascade;
      `);
  }
}
