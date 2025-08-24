import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'aisle',
})
export class Aisle {
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
    type: 'int',
    nullable: false,
  })
  sort_order!: number;
  @Column({
    type: 'text',
    nullable: false,
  })
  description_en!: string;
  @Column({
    type: 'text',
    nullable: false,
  })
  description_pt!: string;
  @Column({
    type: 'text',
    nullable: false,
  })
  icon_key!: string;

  @Column({
    default: true,
    type: 'boolean',
  })
  is_active!: boolean;

  @Column({ type: 'timestamp', default: () => "now()"})
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => "now()"})
  updated_at!: Date;
}
