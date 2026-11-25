#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/054063d0376eb14edb9f6244693e4d14f3a0cef3db4464be6586325629b164dd/contract';
import startContract from '../../snapshots/054063d0376eb14edb9f6244693e4d14f3a0cef3db4464be6586325629b164dd/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/67fa4e358fae57862d5e4612590cc64556f570a79b810c0698136520eaba9947/contract';
import endContract from '../../snapshots/67fa4e358fae57862d5e4612590cc64556f570a79b810c0698136520eaba9947/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'EmailTwoFactorCode',
        columns: [
          col('attempts', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('codeHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('expiresAt', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('usedAt', 'timestamptz(3)', {
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('emailTwoFactorEnabled', 'bool', {
          notNull: true,
          default: lit(false),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
      this.createIndex({
        schema: 'public',
        table: 'EmailTwoFactorCode',
        index: 'EmailTwoFactorCode_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'EmailTwoFactorCode',
        foreignKey: {
          name: 'EmailTwoFactorCode_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
