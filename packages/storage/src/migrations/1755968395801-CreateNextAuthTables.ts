import { MigrationInterface, QueryRunner } from 'typeorm';


export class CreateNextAuthTables1755968395801 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`

      create table if not exists "users"
      (
        id              uuid primary key default gen_random_uuid(),
        name            varchar,
        email           varchar,
        "emailVerified" varchar,
        image           varchar
      );


      create table accounts
      (
        id                  uuid default uuid_generate_v4() not null
          primary key,
        "userId"            uuid                            not null
          references users,
        type                varchar                         not null,
        provider            varchar                         not null,
        "providerAccountId" varchar                         not null,
        refresh_token       varchar,
        access_token        varchar,
        expires_at          bigint,
        token_type          varchar,
        scope               varchar,
        id_token            varchar,
        session_state       varchar
      );

      create table sessions
      (
        id             uuid default uuid_generate_v4() not null
          primary key,
        "sessionToken" varchar                         not null
          unique,
        "userId"       uuid                            not null
          references users,
        expires        varchar                         not null
      );


      create table verification_tokens
      (
        id         uuid default uuid_generate_v4() not null
          primary key,
        token      varchar                         not null,
        identifier varchar                         not null,
        expires    varchar                         not null
      );

    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop table verification_tokens;
      drop table sessions;
      drop table accounts;
      drop table users;
    `);
  }
}