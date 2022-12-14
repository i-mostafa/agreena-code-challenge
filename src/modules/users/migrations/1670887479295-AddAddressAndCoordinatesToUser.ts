import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAddressAndCoordinatesToUser1670887479295 implements MigrationInterface {
  public name = "AddAddressAndCoordinatesToUser1670887479295";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD "coordinates" json NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "access_token" DROP CONSTRAINT "FK_9949557d0e1b2c19e5344c171e9"`);
    await queryRunner.query(`ALTER TABLE "access_token" ALTER COLUMN "updatedAt" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "access_token" ALTER COLUMN "userId" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "access_token" ADD CONSTRAINT "FK_9949557d0e1b2c19e5344c171e9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "access_token" DROP CONSTRAINT "FK_9949557d0e1b2c19e5344c171e9"`);
    await queryRunner.query(`ALTER TABLE "access_token" ALTER COLUMN "userId" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "access_token" ALTER COLUMN "updatedAt" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "access_token" ADD CONSTRAINT "FK_9949557d0e1b2c19e5344c171e9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "coordinates"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
  }
}
