#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/054063d0376eb14edb9f6244693e4d14f3a0cef3db4464be6586325629b164dd/contract';
import endContract from '../../snapshots/054063d0376eb14edb9f6244693e4d14f3a0cef3db4464be6586325629b164dd/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/a312b65df8377a5070044b6a968d8b2ef02f5d61d37bd757af78ce88afa929dd/contract';
import startContract from '../../snapshots/a312b65df8377a5070044b6a968d8b2ef02f5d61d37bd757af78ce88afa929dd/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'EmailVerification',
        columns: [
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('expiresAt', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tokenHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('usedAt', 'timestamptz(3)', {
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'EmailVerification',
        constraint: 'EmailVerification_tokenHash_key',
        columns: ['tokenHash'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'EmailVerification',
        index: 'EmailVerification_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'EmailVerification',
        foreignKey: {
          name: 'EmailVerification_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
