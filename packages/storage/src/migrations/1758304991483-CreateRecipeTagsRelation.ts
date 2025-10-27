import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRecipeTagsRelation1758304991483
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create table recipe_tag_relation (
          recipe_id uuid not null references recipe (id) on delete cascade on update cascade,
          tag text not null references recipe_tag (slug) on delete cascade on update cascade,
          PRIMARY KEY (recipe_id, tag)
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        drop table recipe_tag_relation cascade;
      `);
  }
}
