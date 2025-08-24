import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRecomputeRecipeTrigger1756077945878 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        create or replace function trg_recompute_recipe() returns trigger as $$
        declare rid uuid;
        begin
          rid := coalesce(new.id, old.id);
          perform compute_recipe_totals(rid);
          return coalesce(new, old);
        end $$ language plpgsql;
        
        create trigger trg_recipe_totals_on_ri
          after insert or update or delete on recipe_ingredient
          for each row execute procedure trg_recompute_recipe();
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        drop trigger trg_recipe_totals_on_ri on recipe_ingredient;
        drop function trg_recompute_recipe();
      `);
    }

}
