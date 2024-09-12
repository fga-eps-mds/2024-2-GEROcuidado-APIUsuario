import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCreatedAtUpdatedAtToUsuario1725205303955 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns(
      'usuario',
      [
        new TableColumn({
          name: 'created_at',
          type: 'timestamp',
          default: 'now()'
        }),
        new TableColumn({
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()'
        })
      ]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns(
      'usuario',
      [
        new TableColumn({ name: 'created_at', type: 'timestamp' }),
        new TableColumn({ name: 'updated_at', type: 'timestamp' })
      ]
    )
  }
}
