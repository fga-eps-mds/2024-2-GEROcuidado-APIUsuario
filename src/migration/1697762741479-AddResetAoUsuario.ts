import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddResetFieldsToUsuario1697762741479 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "usuario"
      ADD COLUMN "codigoReset" VARCHAR(255),
      ADD COLUMN "codigoResetExpiracao" TIMESTAMP;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "usuario"
      DROP COLUMN "codigoReset",
      DROP COLUMN "codigoResetExpiracao";
    `);
  }
}
