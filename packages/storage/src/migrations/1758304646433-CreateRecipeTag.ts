import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRecipeTag1758304646433 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE recipe_tag
        (
          slug text PRIMARY KEY,
          slug_en text not null,
          slug_pt text not null
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        drop table recipe_tag cascade;
      `);
  }
}
