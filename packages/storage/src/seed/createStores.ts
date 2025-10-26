import { EntityManager } from 'typeorm';
import { Store } from '../entities';

export default async function createStores(
  manager: EntityManager,
): Promise<Store[]> {
  const stores = [
    manager.create(Store, {
      slug: 'continente',
      name_en: 'Continente',
      name_pt: 'Continente',
      website_url: 'https://www.continente.pt',
      logo_url: 'https://cdn.example.com/stores/continente.svg',
      is_active: true,
    }),
    manager.create(Store, {
      slug: 'pingo-doce',
      name_en: 'Pingo Doce',
      name_pt: 'Pingo Doce',
      website_url: 'https://www.pingodoce.pt',
      logo_url: 'https://cdn.example.com/stores/pingo-doce.svg',
      is_active: true,
    }),
  ];
  await manager.save(stores);
  return stores;
}
