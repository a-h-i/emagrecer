import { MigrationInterface, QueryRunner } from 'typeorm';
import { seed } from '../seed';

export class SeedDatabase1761478545489 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await seed(queryRunner.manager);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      truncate table recipe cascade;
      truncate table ingredient cascade;
      truncate table aisle cascade;
      truncate table store cascade;
      truncate table recipe_tag cascade;
      `);
  }
}
