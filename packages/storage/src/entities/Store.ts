import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'store',
})
export class Store {
  @PrimaryColumn('text')
  slug!: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  name_en!: string;
  @Column({
    type: 'text',
    nullable: false,
  })
  name_pt!: string;

  @Column({
    type: 'text',
  })
  website_url!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  logo_url!: string | null;

  @Column({
    type: 'boolean',
    default: true,
  })
  is_active!: boolean;

  @Column({ type: 'timestamp', default: () => 'now()' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'now()' })
  updated_at!: Date;
}
