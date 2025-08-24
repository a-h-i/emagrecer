import 'reflect-metadata';
import 'server-only';
import { DataSource, DataSourceOptions } from 'typeorm';
import { migrations } from '@/lib/db/migrations';
import { entities } from '@/lib/db/entities';
import assert from 'assert';

export function getPgConfig(runMigrations = false): DataSourceOptions {
  const pgHost = process.env.PG_HOST;
  const pgPort = process.env.PG_PORT;
  const user = process.env.PG_USER;
  const password = process.env.PG_PASSWORD;
  const db = process.env.PG_DB;
  assert(pgHost != null, 'pg host must be provided');
  assert(pgPort != null, 'pg port must be provided');
  assert(user != null, 'pg user must be provided');
  assert(password != null, 'pg password must be provided');
  assert(db != null, 'pg db must be provided');
  return {
    type: 'postgres',
    replication: {
      master: {
        host: pgHost,
        port: Number.parseInt(pgPort, 10),
        username: user,
        password: password,
        database: db,
      },
      slaves: [],
    },
    poolSize: Number.parseInt(process.env.PG_POOL_SIZE ?? '10', 10),
    synchronize: false,
    migrationsRun: runMigrations,
    entities: entities,
    migrations: migrations,
    connectTimeoutMS: 60 * 1000,
    extra: {
      connectionTimeoutMillis: 60 * 1000,
      idleTimeoutMillis: 0,
      application_name: 'emagrecer_app',
    },
    logging: ['warn', 'error', 'migration'],
  };
}

function createPgDataSource(runMigrations: boolean): DataSource {
  return new DataSource(getPgConfig(runMigrations));
}

type DSBag = { __ds?: DataSource; __dsInit?: Promise<DataSource> };
const bag = globalThis as unknown as DSBag;

export const dataSource =
  bag.__ds ?? (bag.__ds = createPgDataSource(true));

export async function getDS(): Promise<DataSource> {
  if (dataSource.isInitialized) {
    return dataSource;
  }
  if (!bag.__dsInit) {
    bag.__dsInit = dataSource.initialize().catch((e) => {
      bag.__dsInit = undefined; // allow retry on next call
      throw e;
    });
  }
  return bag.__dsInit;
}
