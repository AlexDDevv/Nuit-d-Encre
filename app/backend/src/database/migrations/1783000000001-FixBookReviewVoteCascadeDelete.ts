import { MigrationInterface, QueryRunner } from "typeorm";

export class FixBookReviewVoteCascadeDelete1783000000001
    implements MigrationInterface
{
    name = "FixBookReviewVoteCascadeDelete1783000000001";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_review_vote" DROP CONSTRAINT "FK_057d9ab02fdab08697521e0abb2"`);
        await queryRunner.query(`
            ALTER TABLE "book_review_vote"
            ADD CONSTRAINT "FK_057d9ab02fdab08697521e0abb2"
            FOREIGN KEY ("reviewId") REFERENCES "book_review"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_review_vote" DROP CONSTRAINT "FK_057d9ab02fdab08697521e0abb2"`);
        await queryRunner.query(`
            ALTER TABLE "book_review_vote"
            ADD CONSTRAINT "FK_057d9ab02fdab08697521e0abb2"
            FOREIGN KEY ("reviewId") REFERENCES "book_review"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
}
