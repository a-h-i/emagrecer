import { Column, Entity } from 'typeorm';


@Entity({
  name: 'user_price_override',
})
export class UserPriceOverride {
  @Column({
    type: 'uuid',
    primary: true,
  })
  user_id!: string;
  @Column({
    type: 'uuid',
    primary: true,
  })
  ingredient_id!: string;

  @Column({
    type: 'text',
    nullable: false,
    primary: true,
  })
  store_slug!: string;

  @Column({ type: "numeric", precision: 10, scale: 2, primary: true })
  size_g!: string;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  unit_price_eur!: string;

  @Column({ type: 'timestamp', default: () => "now()"})
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => "now()"})
  updated_at!: Date;
}