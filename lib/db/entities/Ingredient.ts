import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UnitEnum } from '@/lib/db/entities/UnitEnum';
import type { NurtitionInfo } from '@/lib/db/entities/NurtitionInfo';

@Entity({
  name: 'ingredient',
})
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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
    nullable: false,
  })
  aisle_slug!: string;

  @Column({ type: 'enum', enum: UnitEnum, default: UnitEnum.GRAM })
  unit_base!: UnitEnum;

  @Column({ type: "numeric", precision: 10, scale: 6, nullable: true })
  density_g_per_ml!: string | null;

  @Column({
    type: 'jsonb',
    nullable: false
  })
  nutrition_per_100g!: NurtitionInfo;


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
