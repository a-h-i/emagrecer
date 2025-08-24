import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUnitEnum1755968586518 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            CREATE TYPE unit_enum AS ENUM ('g', 'ml', 'piece');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            DROP TYPE unit_enum;
        `);
    }

}
