import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserPriceOverride1755994119078 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        CREATE TABLE user_price_override
        (
          user_id        uuid           not null references users (id) on delete cascade on update cascade,
          ingredient_id  uuid           not null references ingredient (id) on delete cascade on update cascade,
          store_slug     text           not null references store (slug) on delete cascade on update cascade,
          size_g         numeric(10, 2) not null,
          unit_price_eur numeric(10, 2) not null,
          created_at     timestamptz    NOT NULL DEFAULT now(),
          updated_at     timestamptz    NOT NULL DEFAULT now(),
          constraint user_price_override_pk primary key (user_id, ingredient_id, store_slug, size_g)
        );
        create trigger user_price_override_set_updated_at
          before update
          on user_price_override
          for each row
          execute procedure set_updated_at();
      `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        DROP TABLE user_price_override cascade;
      `)
    }

}
