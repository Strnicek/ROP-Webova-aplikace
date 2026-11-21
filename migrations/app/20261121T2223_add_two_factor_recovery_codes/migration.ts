#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/09a28cfca078859ded0552e750a31c643bda15dd819c9f19b9f17a7a3cf46e04/contract';
import endContract from '../../snapshots/09a28cfca078859ded0552e750a31c643bda15dd819c9f19b9f17a7a3cf46e04/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/254485a17d57edf4d69c319af80c30e5434584b23b20e3905425db84377116b9/contract';
import startContract from '../../snapshots/254485a17d57edf4d69c319af80c30e5434584b23b20e3905425db84377116b9/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'TwoFactorRecoveryCode',
        columns: [
          col('codeHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('usedAt', 'timestamptz(3)', {
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'TwoFactorRecoveryCode',
        constraint: 'TwoFactorRecoveryCode_codeHash_key',
        columns: ['codeHash'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'TwoFactorRecoveryCode',
        index: 'TwoFactorRecoveryCode_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'TwoFactorRecoveryCode',
        foreignKey: {
          name: 'TwoFactorRecoveryCode_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
