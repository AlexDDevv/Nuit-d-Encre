import { MigrationInterface, QueryRunner } from "typeorm";

export class AddXpKeyToUserActions1785000000000 implements MigrationInterface {
    name = "AddXpKeyToUserActions1785000000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user_actions" ADD COLUMN "xpKey" character varying(255)`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "UQ_user_actions_user_type_xpKey" ON "user_actions" ("userId", "type", "xpKey") WHERE "xpKey" IS NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "UQ_user_actions_user_type_xpKey"`);
        await queryRunner.query(`ALTER TABLE "user_actions" DROP COLUMN "xpKey"`);
    }
}
