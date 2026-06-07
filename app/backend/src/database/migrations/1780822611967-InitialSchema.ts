import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1780822611967 implements MigrationInterface {
    name = 'InitialSchema1780822611967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Required by all search queries (book, author, user library).
        // Also created at startup in server.ts as a safety net.
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS unaccent`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdById" integer, CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "author" ("id" SERIAL NOT NULL, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "birthDate" character varying, "nationality" character varying, "biography" character varying(10000), "wikipediaUrl" character varying, "officialWebsite" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_book_status_enum" AS ENUM('to_read', 'reading', 'read', 'paused')`);
        await queryRunner.query(`CREATE TABLE "user_book" ("id" SERIAL NOT NULL, "status" "public"."user_book_status_enum" NOT NULL DEFAULT 'to_read', "startedAt" date, "finishedAt" date, "isPublic" boolean NOT NULL DEFAULT true, "isFavorite" boolean NOT NULL DEFAULT false, "favoriteRank" integer, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer, "bookId" integer, CONSTRAINT "UQ_user_book" UNIQUE ("userId", "bookId"), CONSTRAINT "PK_3fdacff8af7da81a1cab6bc9f17" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_book" ON "user_book" ("bookId") `);
        await queryRunner.query(`CREATE INDEX "IDX_user" ON "user_book" ("userId") `);
        await queryRunner.query(`CREATE TABLE "book_review_vote" ("id" SERIAL NOT NULL, "isHelpful" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "reviewId" integer, CONSTRAINT "UQ_7dbda9563c8b0b753c3c1de5fb4" UNIQUE ("userId", "reviewId"), CONSTRAINT "PK_8d4ff884046716fef2cbb3e19d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book_review" ("id" SERIAL NOT NULL, "rating" integer NOT NULL, "reviewText" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "bookId" integer, CONSTRAINT "UQ_4b7c834da28f4a48961bcaf74ee" UNIQUE ("userId", "bookId"), CONSTRAINT "PK_ea377383a8a131c7c839aa0c21b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book_recommendation" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "bookId" integer, CONSTRAINT "UQ_6244fe22215f4ff0948dd596a99" UNIQUE ("userId", "bookId"), CONSTRAINT "PK_667c2694798399ad748658aeb9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."book_format_enum" AS ENUM('hardcover', 'paperback', 'softcover', 'pocket')`);
        await queryRunner.query(`CREATE TABLE "book" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "summary" character varying(5000) NOT NULL, "isbn10" character varying(10), "isbn13" character varying(13) NOT NULL, "pageCount" integer NOT NULL, "publishedYear" integer NOT NULL, "language" character varying(5) NOT NULL, "publisher" character varying(255) NOT NULL, "format" "public"."book_format_enum" NOT NULL, "coverUrl" character varying, "isImported" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" integer, "categoryId" integer, "userId" integer, CONSTRAINT "UQ_c10a44a29ef231062f22b1b7ac5" UNIQUE ("title"), CONSTRAINT "UQ_f3fe6c2f9b4945fc95e6d4fd2e6" UNIQUE ("isbn10"), CONSTRAINT "UQ_f0bd833b91e9938943e39c28cae" UNIQUE ("isbn13"), CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_actions" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "xp" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "targetId" character varying, "metadata" character varying, "userId" integer, CONSTRAINT "PK_3c8a683381b553ee59ce5b7b13a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "title" ("id" SERIAL NOT NULL, "label" character varying(100) NOT NULL, "minLevel" integer NOT NULL, "iconKey" character varying(100) NOT NULL, "ornamentKey" character varying(100), CONSTRAINT "PK_30e6ea2dcc2aae4a4d1f5d9e183" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'moderator', 'admin')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying(254) NOT NULL, "hashedPassword" character varying(255) NOT NULL, "userName" character varying(100) NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "level" integer NOT NULL, "xp" integer NOT NULL, "avatar" text, "banner" text, "bio" character varying(300), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_50c69cdc9b3e7494784a2fa2db4" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "author" ADD CONSTRAINT "FK_645811deaaaa772f9e6c2a4b927" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_book" ADD CONSTRAINT "FK_ab47037d446ad35a3437ad77170" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_book" ADD CONSTRAINT "FK_82b430d61bfdb4e840329b48170" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_review_vote" ADD CONSTRAINT "FK_7d2dc696a8cc8f3ef362afea064" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_review_vote" ADD CONSTRAINT "FK_057d9ab02fdab08697521e0abb2" FOREIGN KEY ("reviewId") REFERENCES "book_review"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_review" ADD CONSTRAINT "FK_bae7725a0fe20b67dc03d5a4fd9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_review" ADD CONSTRAINT "FK_d47a02807234f545466e113ca0b" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_recommendation" ADD CONSTRAINT "FK_f595a7e2c647d09ee67e019efb0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_recommendation" ADD CONSTRAINT "FK_930042e280263cf8eb4044c796b" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "FK_66a4f0f47943a0d99c16ecf90b2" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "FK_efaa1a4d8550ba5f4378803edb2" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "FK_04f66cf2a34f8efc5dcd9803693" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_actions" ADD CONSTRAINT "FK_e65a8053e5b02e0b89947b6bac9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_actions" DROP CONSTRAINT "FK_e65a8053e5b02e0b89947b6bac9"`);
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "FK_04f66cf2a34f8efc5dcd9803693"`);
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "FK_efaa1a4d8550ba5f4378803edb2"`);
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "FK_66a4f0f47943a0d99c16ecf90b2"`);
        await queryRunner.query(`ALTER TABLE "book_recommendation" DROP CONSTRAINT "FK_930042e280263cf8eb4044c796b"`);
        await queryRunner.query(`ALTER TABLE "book_recommendation" DROP CONSTRAINT "FK_f595a7e2c647d09ee67e019efb0"`);
        await queryRunner.query(`ALTER TABLE "book_review" DROP CONSTRAINT "FK_d47a02807234f545466e113ca0b"`);
        await queryRunner.query(`ALTER TABLE "book_review" DROP CONSTRAINT "FK_bae7725a0fe20b67dc03d5a4fd9"`);
        await queryRunner.query(`ALTER TABLE "book_review_vote" DROP CONSTRAINT "FK_057d9ab02fdab08697521e0abb2"`);
        await queryRunner.query(`ALTER TABLE "book_review_vote" DROP CONSTRAINT "FK_7d2dc696a8cc8f3ef362afea064"`);
        await queryRunner.query(`ALTER TABLE "user_book" DROP CONSTRAINT "FK_82b430d61bfdb4e840329b48170"`);
        await queryRunner.query(`ALTER TABLE "user_book" DROP CONSTRAINT "FK_ab47037d446ad35a3437ad77170"`);
        await queryRunner.query(`ALTER TABLE "author" DROP CONSTRAINT "FK_645811deaaaa772f9e6c2a4b927"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_50c69cdc9b3e7494784a2fa2db4"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "title"`);
        await queryRunner.query(`DROP TABLE "user_actions"`);
        await queryRunner.query(`DROP TABLE "book"`);
        await queryRunner.query(`DROP TYPE "public"."book_format_enum"`);
        await queryRunner.query(`DROP TABLE "book_recommendation"`);
        await queryRunner.query(`DROP TABLE "book_review"`);
        await queryRunner.query(`DROP TABLE "book_review_vote"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_book"`);
        await queryRunner.query(`DROP TABLE "user_book"`);
        await queryRunner.query(`DROP TYPE "public"."user_book_status_enum"`);
        await queryRunner.query(`DROP TABLE "author"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
