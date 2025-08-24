import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStore1755992638722 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        CREATE TABLE store
        (
          slug        text PRIMARY KEY,
          name_en     text        NOT NULL,
          name_pt     text        NOT NULL,
          website_url text        not null,
          logo_url    text        not null,
          is_active   boolean     not null default true,
          created_at  timestamptz NOT NULL DEFAULT now(),
          updated_at  timestamptz NOT NULL DEFAULT now()
        );
        create trigger store_set_updated_at
          before update
          on store
          for each row execute procedure set_updated_at();
      `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        DROP TABLE store cascade;
      `)
    }

}
