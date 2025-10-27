import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { DataSource } from 'typeorm';
import { createPgDataSource } from '@emagrecer/storage';
import { getOrCreateProfile } from '../../src';
import { randomUUID } from 'crypto';
import { UserEntity } from '@emagrecer/storage';
import { faker } from '@faker-js/faker';

describe('getOrCreateProfile', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = createPgDataSource(true);
    await source.initialize();
  });

  afterAll(async () => {
    await source.manager.query(
      `
      truncate user_profile cascade;
      truncate "users" cascade;
      `,
    );
    await source.destroy();
  });

  it('fails to create profile for non-existing user', async () => {
    await expect(getOrCreateProfile(source, randomUUID())).rejects.toThrow();
  });

  it('creates profile for existing user', async () => {
    const user = source.manager.create(UserEntity, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    });
    await source.manager.save(user);
    const profile = await getOrCreateProfile(source, user.id);
    expect(profile.user_id).toStrictEqual(user.id);
  });
  it('fetches an existing profile', async () => {
    const user = source.manager.create(UserEntity, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    });
    await source.manager.save(user);
    const profile = await getOrCreateProfile(source, user.id);
    const loadedProfile = await getOrCreateProfile(source, user.id);
    expect(loadedProfile.user_id).toStrictEqual(profile.user_id);
  });
});
