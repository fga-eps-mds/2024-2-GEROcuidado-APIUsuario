import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDtNascUser1733707113541 implements MigrationInterface {
    name = 'AddDtNascUser1733707113541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" ADD "data_nascimento" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD "descricao" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "usuario" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`);
        await queryRunner.query(`ALTER TABLE "usuario" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "usuario" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "descricao"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "data_nascimento"`);
    }

}
