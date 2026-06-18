import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateSiteBanner1781000000000 implements MigrationInterface {
    name = "CreateSiteBanner1781000000000"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "site_banner" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "title" character varying(120) NOT NULL,
                "message" text,
                "variant" character varying(20) NOT NULL DEFAULT 'info',
                "audience" character varying(20) NOT NULL DEFAULT 'ALL',
                "dismissible" boolean NOT NULL DEFAULT true,
                "actionLabel" character varying(60),
                "actionUrl" character varying,
                "isActive" boolean NOT NULL DEFAULT false,
                "createdById" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_site_banner_id" PRIMARY KEY ("id")
            )
        `)
        await queryRunner.query(`
            ALTER TABLE "site_banner"
            ADD CONSTRAINT "FK_site_banner_createdBy"
            FOREIGN KEY ("createdById") REFERENCES "user"("id")
            ON DELETE SET NULL ON UPDATE NO ACTION
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "site_banner" DROP CONSTRAINT "FK_site_banner_createdBy"`,
        )
        await queryRunner.query(`DROP TABLE "site_banner"`)
    }
}
