import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({
  name: 'recipe',
})
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'text',
  })
  title_en!: string;
  @Column({
    type: 'text',
  })
  title_pt!: string;

  @Column({
    type: 'text',
  })
  slug!: string;

  @Column({ type: 'int', default: 2 })
  servings!: number;

  @Column({ type: 'text', nullable: true })
  instructions_md_en!: string | null;
  @Column({ type: 'text', nullable: true })
  instructions_md_pt!: string | null;

  @Column('text', { array: true, default: '[]' })
  tags!: string[];

  @Column({ type: 'int'})
  kcal_per_serving!: number;

  @Column({ type: 'numeric', precision: 6, scale: 2 })
  protein_g_per_serving!: string;

  @Column({ type: 'numeric', precision: 6, scale: 2})
  carbs_g_per_serving!: string;
  @Column({ type: 'numeric', precision: 6, scale: 2})
  fat_g_per_serving!: string;

  @Column({ type: 'uuid', nullable: true })
  created_by_user_id!: string | null;

  @Column({ type: 'timestamp', default: () => "now()"})
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => "now()"})
  updated_at!: Date;
}
