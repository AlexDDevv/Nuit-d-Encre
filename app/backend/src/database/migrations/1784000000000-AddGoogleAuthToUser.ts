import { MigrationInterface, QueryRunner } from "typeorm"

export class AddGoogleAuthToUser1784000000000 implements MigrationInterface {
    name = "AddGoogleAuthToUser1784000000000"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user" ADD COLUMN "googleId" character varying(255)`,
        )
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "UQ_user_googleId" UNIQUE ("googleId")`,
        )
        await queryRunner.query(
            `ALTER TABLE "user" ALTER COLUMN "hashedPassword" DROP NOT NULL`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user" ALTER COLUMN "hashedPassword" SET NOT NULL`,
        )
        await queryRunner.query(
            `ALTER TABLE "user" DROP CONSTRAINT "UQ_user_googleId"`,
        )
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "googleId"`)
    }
}
