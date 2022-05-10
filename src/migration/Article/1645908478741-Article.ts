import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export default class Article1645908478741 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'article',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isNullable: false,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'minuteReadingTime',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'wordCount',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'articleDetailId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()', // expression default
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'version',
            type: 'int',
            isNullable: false,
            isGenerated: true,
            generationStrategy: 'increment',
          },
        ],
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('article', true)
  }
}
