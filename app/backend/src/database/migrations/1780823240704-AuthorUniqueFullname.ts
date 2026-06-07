import { MigrationInterface, QueryRunner } from "typeorm";

export class AuthorUniqueFullname1780823240704 implements MigrationInterface {
    name = 'AuthorUniqueFullname1780823240704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "author" ADD CONSTRAINT "UQ_author_fullname" UNIQUE ("firstname", "lastname")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "author" DROP CONSTRAINT "UQ_author_fullname"`);
    }

}
