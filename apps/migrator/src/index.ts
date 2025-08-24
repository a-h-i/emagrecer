import { config } from 'dotenv';
import { createPgDataSource } from '@emagrecer/storage';
config();

async function runMigrations() {
  const source = createPgDataSource(true);
  await source.initialize();
  await source.runMigrations();
  await source.destroy();
}

runMigrations()
  .catch(console.error)
  .then(() => console.log('done'));
