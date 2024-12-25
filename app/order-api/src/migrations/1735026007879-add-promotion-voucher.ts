import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPromotionVoucher1735026007879 implements MigrationInterface {
    name = 'AddPromotionVoucher1735026007879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`promotion_tbl\` (\`id_column\` varchar(36) NOT NULL, \`slug_column\` varchar(255) NOT NULL, \`created_at_column\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at_column\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at_column\` datetime(6) NULL, \`created_by_column\` varchar(255) NULL, \`name_column\` text NOT NULL, \`status_column\` varchar(255) NOT NULL DEFAULT 'upcoming', \`type_column\` varchar(255) NOT NULL, \`discount_type_column\` varchar(255) NOT NULL, \`discount_value_column\` int NOT NULL, \`start_date_column\` datetime NOT NULL, \`end_date_column\` datetime NOT NULL, \`usage_limit_column\` int NOT NULL, \`min_purcahse_column\` int NULL DEFAULT '0', UNIQUE INDEX \`IDX_e4f4279c7e9d221622231232d3\` (\`slug_column\`), PRIMARY KEY (\`id_column\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`voucher_tbl\` (\`id_column\` varchar(36) NOT NULL, \`slug_column\` varchar(255) NOT NULL, \`created_at_column\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at_column\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at_column\` datetime(6) NULL, \`created_by_column\` varchar(255) NULL, \`code_column\` varchar(255) NOT NULL, \`description_column\` text NULL, \`promotion_column\` varchar(36) NULL, UNIQUE INDEX \`IDX_b96104224304d04ca3fba7c02f\` (\`slug_column\`), UNIQUE INDEX \`IDX_c54f532ec43d72ca0035230f56\` (\`code_column\`), UNIQUE INDEX \`REL_18ac6e7e05bef9ff6fa9fef20e\` (\`promotion_column\`), PRIMARY KEY (\`id_column\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`voucher_tbl\` ADD CONSTRAINT \`FK_18ac6e7e05bef9ff6fa9fef20e6\` FOREIGN KEY (\`promotion_column\`) REFERENCES \`promotion_tbl\`(\`id_column\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`voucher_tbl\` DROP FOREIGN KEY \`FK_18ac6e7e05bef9ff6fa9fef20e6\``);
        await queryRunner.query(`DROP INDEX \`REL_18ac6e7e05bef9ff6fa9fef20e\` ON \`voucher_tbl\``);
        await queryRunner.query(`DROP INDEX \`IDX_c54f532ec43d72ca0035230f56\` ON \`voucher_tbl\``);
        await queryRunner.query(`DROP INDEX \`IDX_b96104224304d04ca3fba7c02f\` ON \`voucher_tbl\``);
        await queryRunner.query(`DROP TABLE \`voucher_tbl\``);
        await queryRunner.query(`DROP INDEX \`IDX_e4f4279c7e9d221622231232d3\` ON \`promotion_tbl\``);
        await queryRunner.query(`DROP TABLE \`promotion_tbl\``);
    }

}
