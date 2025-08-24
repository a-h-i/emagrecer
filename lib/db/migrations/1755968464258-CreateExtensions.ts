import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExtensions1755968464258 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS "pgcrypto";
            CREATE EXTENSION IF NOT EXISTS "pg_trgm";
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
