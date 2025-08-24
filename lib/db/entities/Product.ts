import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'product',
})
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  store_slug!: string;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  ingredient_id!: string;

  @Column({ type: 'text', nullable: true })
  brand!: string | null;

  @Column({ type: 'text' })
  label!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  size_g!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  unit_price_eur!: string;

  @Column({
    default: true,
    type: 'boolean',
  })
  is_active!: boolean;

  @Column({ type: 'timestamp', default: () => 'now()' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'now()' })
  updated_at!: Date;
}
