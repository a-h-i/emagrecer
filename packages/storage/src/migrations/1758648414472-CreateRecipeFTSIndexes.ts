import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRecipeFTSIndexes1758648414472 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create index recipe_fts_en_idx on recipe using gin (text_searchable_en);
        create index recipe_fts_pt_idx on recipe using gin (text_searchable_pt);
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        drop index recipe_fts_en_idx;
        drop index recipe_fts_pt_idx;
      `);
  }
}
