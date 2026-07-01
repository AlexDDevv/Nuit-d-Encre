import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBookReviewComment1783000000000
    implements MigrationInterface
{
    name = "CreateBookReviewComment1783000000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "book_review_comment" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "content" text NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                "reviewId" uuid,
                CONSTRAINT "PK_book_review_comment" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "book_review_comment"
            ADD CONSTRAINT "FK_book_review_comment_user"
            FOREIGN KEY ("userId") REFERENCES "user"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "book_review_comment"
            ADD CONSTRAINT "FK_book_review_comment_review"
            FOREIGN KEY ("reviewId") REFERENCES "book_review"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_review_comment" DROP CONSTRAINT "FK_book_review_comment_review"`);
        await queryRunner.query(`ALTER TABLE "book_review_comment" DROP CONSTRAINT "FK_book_review_comment_user"`);
        await queryRunner.query(`DROP TABLE "book_review_comment"`);
    }
}
