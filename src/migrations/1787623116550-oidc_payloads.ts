import { MigrationInterface, QueryRunner } from "typeorm";

export class OidcPayloads1787623116550 implements MigrationInterface {
    name = 'OidcPayloads1787623116550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` tinyint UNSIGNED NOT NULL AUTO_INCREMENT, \`nombre\` varchar(20) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`empleados\` (\`id\` mediumint UNSIGNED NOT NULL AUTO_INCREMENT, \`no_empleado\` mediumint UNSIGNED NOT NULL, \`nombre\` varchar(36) NOT NULL, \`apellido_paterno\` varchar(21) NOT NULL, \`apellido_materno\` varchar(21) NULL, \`fecha_nacimiento\` date NOT NULL, \`fecha_ingreso\` date NOT NULL, \`imagen\` varchar(255) NULL, \`departamento\` enum ('supplychain', 'transportes', 'seguridad') NOT NULL, \`puesto\` varchar(34) NOT NULL, \`estado\` enum ('disponible', 'ocupado') NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`otp_token\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`codigo\` varchar(6) NOT NULL, \`fecha_expiracion\` datetime NOT NULL, \`fecha_uso\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`usuario_id\` mediumint UNSIGNED NULL, UNIQUE INDEX \`REL_65b87e8cb313c9c2bfbaf893bd\` (\`usuario_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`usuarios\` (\`id\` mediumint UNSIGNED NOT NULL AUTO_INCREMENT, \`username\` varchar(20) NOT NULL, \`password\` varchar(255) NOT NULL, \`celular\` varchar(10) NOT NULL, \`email\` varchar(30) NOT NULL, \`estado\` enum ('activo', 'inactivo') NOT NULL DEFAULT 'activo', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`rol_id\` tinyint UNSIGNED NULL, \`empleado_id\` mediumint UNSIGNED NULL, UNIQUE INDEX \`REL_a263b94b107a7aa7bb71f951c9\` (\`empleado_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`auditoria_log\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`evento\` enum ('login_exitoso', 'logout', 'otp_expirado', 'otp_incorrecto', 'password_incorrecto') NOT NULL, \`ip\` varchar(15) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`usuario_id\` mediumint UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`oidc_payloads\` (\`type\` varchar(100) NOT NULL, \`id\` varchar(255) NOT NULL, \`payload\` json NOT NULL, \`grant_id\` varchar(255) NULL, \`user_code\` varchar(255) NULL, \`uid\` varchar(255) NULL, \`expires_at\` datetime NULL, \`consumed_at\` datetime NULL, INDEX \`IDX_0be7e5c1f8c66e58631313ed59\` (\`uid\`), INDEX \`IDX_0a9a23cfaeae32481d1108c0f5\` (\`user_code\`), INDEX \`IDX_1bc24a149a0247f41842e12dea\` (\`grant_id\`), PRIMARY KEY (\`type\`, \`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`otp_token\` ADD CONSTRAINT \`FK_65b87e8cb313c9c2bfbaf893bd9\` FOREIGN KEY (\`usuario_id\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_9e519760a660751f4fa21453d3e\` FOREIGN KEY (\`rol_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_a263b94b107a7aa7bb71f951c92\` FOREIGN KEY (\`empleado_id\`) REFERENCES \`empleados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`auditoria_log\` ADD CONSTRAINT \`FK_6485619e1b05359286c664991f4\` FOREIGN KEY (\`usuario_id\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`auditoria_log\` DROP FOREIGN KEY \`FK_6485619e1b05359286c664991f4\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_a263b94b107a7aa7bb71f951c92\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_9e519760a660751f4fa21453d3e\``);
        await queryRunner.query(`ALTER TABLE \`otp_token\` DROP FOREIGN KEY \`FK_65b87e8cb313c9c2bfbaf893bd9\``);
        await queryRunner.query(`DROP INDEX \`IDX_1bc24a149a0247f41842e12dea\` ON \`oidc_payloads\``);
        await queryRunner.query(`DROP INDEX \`IDX_0a9a23cfaeae32481d1108c0f5\` ON \`oidc_payloads\``);
        await queryRunner.query(`DROP INDEX \`IDX_0be7e5c1f8c66e58631313ed59\` ON \`oidc_payloads\``);
        await queryRunner.query(`DROP TABLE \`oidc_payloads\``);
        await queryRunner.query(`DROP TABLE \`auditoria_log\``);
        await queryRunner.query(`DROP INDEX \`REL_a263b94b107a7aa7bb71f951c9\` ON \`usuarios\``);
        await queryRunner.query(`DROP TABLE \`usuarios\``);
        await queryRunner.query(`DROP INDEX \`REL_65b87e8cb313c9c2bfbaf893bd\` ON \`otp_token\``);
        await queryRunner.query(`DROP TABLE \`otp_token\``);
        await queryRunner.query(`DROP TABLE \`empleados\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
    }

}
