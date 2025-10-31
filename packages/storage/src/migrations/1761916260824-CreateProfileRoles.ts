import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProfileRoles1761916260824 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        create table profile_role
        (
          user_id    uuid primary key references user_profile (user_id) on delete cascade on update cascade,
          is_admin   boolean     not null default false,
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now()
        );

        create trigger profile_role_set_updated_at
          before update
          on profile_role
          for each row
        execute procedure set_updated_at();
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        drop table profile_role cascade;
      `);
    }

}
