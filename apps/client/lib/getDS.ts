import 'server-only';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { createPgDataSource } from '@emagrecer/storage';

let cachedSource: DataSource | undefined = undefined;

export async function getDS(): Promise<DataSource> {
  if (cachedSource == null) {
    cachedSource = createPgDataSource(false);
  }
  if (!cachedSource.isInitialized) {
    await cachedSource.initialize();
  }
  return cachedSource;
}
