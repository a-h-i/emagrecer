import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAllergenEnum1755968586517 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE allergen_enum AS ENUM (
            'gluten',
            'crustaceans',
            'eggs',
            'fish',
            'peanuts',
            'soy',
            'milk',
            'tree-nuts',
            'celery',
            'mustard',
            'sesame',
            'sulphites',
            'lupin',
            'molluscs'
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TYPE allergen_enum;
        `);
  }
}
