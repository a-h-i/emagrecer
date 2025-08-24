import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDietPreferenceEnum1755997125098
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create type diet_preference_enum as enum ('vegetarian', 'vegan', 'omnivore', 'pescetarian', 'no_pork');
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop type diet_preference_enum;
      `);
  }
}
