import {MigrationInterface, QueryRunner} from "typeorm";

export class firstMigration1657185618096 implements MigrationInterface {
    name = 'firstMigration1657185618096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE "organizations_id_organization_seq"`);
        await queryRunner.query(`CREATE TABLE "organizations" ("id_organization" INT DEFAULT nextval('"organizations_id_organization_seq"') NOT NULL, "name" char(50) NOT NULL, "status" int8 NOT NULL, CONSTRAINT "PK_9794a00513e2df457c2cd808c7f" PRIMARY KEY ("id_organization"))`);
        await queryRunner.query(`CREATE SEQUENCE "tribes_id_tribe_seq"`);
        await queryRunner.query(`CREATE TABLE "tribes" ("id_tribe" INT DEFAULT nextval('"tribes_id_tribe_seq"') NOT NULL, "name" char(50) NOT NULL, "status" int8 NOT NULL, "organizationIdOrganization" int8, CONSTRAINT "PK_4be16bcfe80b17e04e5e805aa87" PRIMARY KEY ("id_tribe"))`);
        await queryRunner.query(`CREATE INDEX "IDX_244c74351735af7224da3b872d" ON "tribes" ("organizationIdOrganization") `);
        await queryRunner.query(`CREATE SEQUENCE "repositories_id_repository_seq"`);
        await queryRunner.query(`CREATE TABLE "repositories" ("id_repository" INT DEFAULT nextval('"repositories_id_repository_seq"') NOT NULL, "name" char(50) NOT NULL, "state" char(1) NOT NULL, "create_time" timestamp NOT NULL, "status" char(1) NOT NULL, "id_tribe" int8 NOT NULL, CONSTRAINT "PK_8095744125151a8de6f95ce504c" PRIMARY KEY ("id_repository"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cea09123ad19e8bf1cec1b4dbb" ON "repositories" ("id_tribe") `);
        await queryRunner.query(`CREATE TABLE "metrics" ("id_repository" int8 NOT NULL, "coverage" int8 NOT NULL, "bugs" int8 NOT NULL, "hotspot" int8 NOT NULL, "code_smells" int8 NOT NULL, "vulnerabilities" int8 NOT NULL, CONSTRAINT "REL_c3d911b1d911a990e617041947" UNIQUE ("id_repository"), CONSTRAINT "PK_c3d911b1d911a990e617041947b" PRIMARY KEY ("id_repository"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c3d911b1d911a990e617041947" ON "metrics" ("id_repository") `);
        await queryRunner.query(`ALTER TABLE "tribes" ADD CONSTRAINT "FK_244c74351735af7224da3b872db" FOREIGN KEY ("organizationIdOrganization") REFERENCES "organizations"("id_organization") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "repositories" ADD CONSTRAINT "FK_cea09123ad19e8bf1cec1b4dbb2" FOREIGN KEY ("id_tribe") REFERENCES "tribes"("id_tribe") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "metrics" ADD CONSTRAINT "FK_c3d911b1d911a990e617041947b" FOREIGN KEY ("id_repository") REFERENCES "repositories"("id_repository") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "metrics" DROP CONSTRAINT "FK_c3d911b1d911a990e617041947b"`);
        await queryRunner.query(`ALTER TABLE "repositories" DROP CONSTRAINT "FK_cea09123ad19e8bf1cec1b4dbb2"`);
        await queryRunner.query(`ALTER TABLE "tribes" DROP CONSTRAINT "FK_244c74351735af7224da3b872db"`);
        await queryRunner.query(`DROP INDEX "metrics"@"IDX_c3d911b1d911a990e617041947" CASCADE`);
        await queryRunner.query(`DROP TABLE "metrics"`);
        await queryRunner.query(`DROP INDEX "repositories"@"IDX_cea09123ad19e8bf1cec1b4dbb" CASCADE`);
        await queryRunner.query(`DROP TABLE "repositories"`);
        await queryRunner.query(`DROP SEQUENCE "repositories_id_repository_seq"`);
        await queryRunner.query(`DROP INDEX "tribes"@"IDX_244c74351735af7224da3b872d" CASCADE`);
        await queryRunner.query(`DROP TABLE "tribes"`);
        await queryRunner.query(`DROP SEQUENCE "tribes_id_tribe_seq"`);
        await queryRunner.query(`DROP TABLE "organizations"`);
        await queryRunner.query(`DROP SEQUENCE "organizations_id_organization_seq"`);
    }

}
