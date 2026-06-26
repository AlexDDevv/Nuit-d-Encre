import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserFollow1782000000000 implements MigrationInterface {
    name = "CreateUserFollow1782000000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user_follow" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "followerId" uuid,
                "followingId" uuid,
                CONSTRAINT "PK_user_follow" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_user_follow_pair" UNIQUE ("followerId", "followingId")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "user_follow"
            ADD CONSTRAINT "FK_user_follow_follower"
            FOREIGN KEY ("followerId") REFERENCES "user"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_follow"
            ADD CONSTRAINT "FK_user_follow_following"
            FOREIGN KEY ("followingId") REFERENCES "user"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_follow" DROP CONSTRAINT "FK_user_follow_following"`);
        await queryRunner.query(`ALTER TABLE "user_follow" DROP CONSTRAINT "FK_user_follow_follower"`);
        await queryRunner.query(`DROP TABLE "user_follow"`);
    }
}
