import { MigrationInterface, QueryRunner } from "typeorm";

export class OidcPayloads1787623116550 implements MigrationInterface {
    name = 'OidcPayloads1787623116550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`oidc_payloads\` (\`type\` varchar(100) NOT NULL, \`id\` varchar(255) NOT NULL, \`payload\` json NOT NULL, \`grant_id\` varchar(255) NULL, \`user_code\` varchar(255) NULL, \`uid\` varchar(255) NULL, \`expires_at\` datetime NULL, \`consumed_at\` datetime NULL, INDEX \`IDX_0be7e5c1f8c66e58631313ed59\` (\`uid\`), INDEX \`IDX_0a9a23cfaeae32481d1108c0f5\` (\`user_code\`), INDEX \`IDX_1bc24a149a0247f41842e12dea\` (\`grant_id\`), PRIMARY KEY (\`type\`, \`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_1bc24a149a0247f41842e12dea\` ON \`oidc_payloads\``);
        await queryRunner.query(`DROP INDEX \`IDX_0a9a23cfaeae32481d1108c0f5\` ON \`oidc_payloads\``);
        await queryRunner.query(`DROP INDEX \`IDX_0be7e5c1f8c66e58631313ed59\` ON \`oidc_payloads\``);
        await queryRunner.query(`DROP TABLE \`oidc_payloads\``);
    }
}