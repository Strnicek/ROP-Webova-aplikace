#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/054063d0376eb14edb9f6244693e4d14f3a0cef3db4464be6586325629b164dd/contract';
import startContract from '../../snapshots/054063d0376eb14edb9f6244693e4d14f3a0cef3db4464be6586325629b164dd/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/254485a17d57edf4d69c319af80c30e5434584b23b20e3905425db84377116b9/contract';
import endContract from '../../snapshots/254485a17d57edf4d69c319af80c30e5434584b23b20e3905425db84377116b9/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'TwoFactorAuth',
        columns: [
          col('enabled', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('enabledAt', 'timestamptz(3)', {
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('secret', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'TwoFactorAuth',
        constraint: 'TwoFactorAuth_userId_key',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'TwoFactorAuth',
        foreignKey: {
          name: 'TwoFactorAuth_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
