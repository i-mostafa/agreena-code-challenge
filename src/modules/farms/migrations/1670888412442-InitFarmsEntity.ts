import { MigrationInterface, QueryRunner } from "typeorm";

export class InitFarmsEntity1670888412442 implements MigrationInterface {
  public name = "InitFarmsEntity1670888412442";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "farm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "size" double precision NOT NULL, "yield" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "address" character varying NOT NULL, "coordinates" json NOT NULL, "ownerId" uuid, CONSTRAINT "PK_3bf246b27a3b6678dfc0b7a3f64" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "farm" ADD CONSTRAINT "FK_d5f70ea0d7ab61a43bc2a7ce1a6" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "farm" DROP CONSTRAINT "FK_d5f70ea0d7ab61a43bc2a7ce1a6"`);
    await queryRunner.query(`DROP TABLE "farm"`);
  }
}
