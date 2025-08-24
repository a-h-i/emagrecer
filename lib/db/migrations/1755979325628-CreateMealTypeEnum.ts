import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMealTypeEnum1755979325628 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            CREATE TYPE meal_type_enum AS ENUM ('breakfast', 'lunch', 'dinner', 'snack', 'dessert');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            DROP TYPE meal_type_enum;
        `);
    }

}
