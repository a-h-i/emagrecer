import { Column, Entity, PrimaryColumn } from 'typeorm';
import { DietPreference } from '@/lib/db/entities/DietPreference';
import { Allergens } from '@/lib/db/entities/Allergens';
import { MacroSplit } from '@/lib/db/entities/MacroSplit';


@Entity({
  name: 'user_profile',
})
export class UserProfile {
  @PrimaryColumn({
    type: 'uuid',
  })
  user_id!: string;

  @Column({
    type: 'enum',
    enum: DietPreference,
  })
  diet_preference!: DietPreference;

  @Column({
    type: 'enum',
    enum: Allergens,
    array: true,
    default: [],
  })
  allergens!: Allergens[];

  @Column({ type: 'int', nullable: true })
  kcal_target!: number | null;

  @Column({ type: "jsonb", nullable: true })
  macro_split!: MacroSplit | null;

  @Column({ type: 'int', nullable: true })
  height_cm!: number | null;

  @Column({ type: 'int', nullable: true })
  weight_kg!: number | null;

  @Column({ type: 'text', nullable: true })
  default_store_slug!: string | null;

  @Column({ type: 'timestamp', default: () => "now()"})
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => "now()"})
  updated_at!: Date;

}