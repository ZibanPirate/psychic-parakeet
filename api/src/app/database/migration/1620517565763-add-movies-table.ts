import { MigrationInterface, QueryRunner } from "typeorm";

export class addMoviesTable1620517565763 implements MigrationInterface {
  name = "addMoviesTable1620517565763";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "movies" ("id" character varying NOT NULL, "title" character varying NOT NULL, "year" character varying NOT NULL, "poster" character varying, "director" character varying, "plot" text, CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "movies"`);
  }
}
