#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/4c8fb0dacf9830584f55253a9064aa43b91242859c59284e583f5e18f70867ce/contract';
import startContract from '../../snapshots/4c8fb0dacf9830584f55253a9064aa43b91242859c59284e583f5e18f70867ce/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/a312b65df8377a5070044b6a968d8b2ef02f5d61d37bd757af78ce88afa929dd/contract';
import endContract from '../../snapshots/a312b65df8377a5070044b6a968d8b2ef02f5d61d37bd757af78ce88afa929dd/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('emailVerifiedAt', 'timestamptz(3)', {
          codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
