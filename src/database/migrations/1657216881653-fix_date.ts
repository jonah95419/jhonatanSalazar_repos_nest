import {MigrationInterface, QueryRunner} from "typeorm";

export class fixDate1657216881653 implements MigrationInterface {
    name = 'fixDate1657216881653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "repositories" ALTER COLUMN "create_time" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "repositories" ALTER COLUMN "create_time" DROP DEFAULT`);
    }

}
