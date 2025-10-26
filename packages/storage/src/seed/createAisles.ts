import { Aisle } from '../entities';
import { EntityManager } from 'typeorm';

export async function createAisles(manager: EntityManager): Promise<Aisle[]> {
  const aisles = [
    manager.create(Aisle, {
      slug: 'produce',
      name_en: 'Produce',
      name_pt: 'Hortofrutícolas',
      description_en: 'Fresh fruits and vegetables',
      description_pt: 'Frutas e legumes frescos',
      icon_key: 'leafy-greens',
      is_active: true,
    }),
    manager.create(Aisle, {
      slug: 'butchery',
      name_en: 'Butchery',
      name_pt: 'Talho',
      description_en: 'Fresh meats and poultry',
      description_pt: 'Carnes e aves frescas',
      icon_key: 'steak',
      is_active: true,
    }),
    manager.create(Aisle, {
      slug: 'pantry',
      name_en: 'Pantry',
      name_pt: 'Despensa',
      description_en: 'Dry goods and staples',
      description_pt: 'Mercearia e básicos',
      icon_key: 'pantry',
      is_active: true,
    }),
  ];
  await manager.save(aisles);
  return aisles;
}
