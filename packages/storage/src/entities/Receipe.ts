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

  @Column({ type: 'int' })
  kcal_per_serving!: number;

  @Column({ type: 'numeric', precision: 6, scale: 2 })
  protein_g_per_serving!: string;

  @Column({ type: 'numeric', precision: 6, scale: 2 })
  carbs_g_per_serving!: string;
  @Column({ type: 'numeric', precision: 6, scale: 2 })
  fat_g_per_serving!: string;

  @Column({ type: 'uuid', nullable: true })
  created_by_user_id!: string | null;

  @Column({ type: 'timestamp', default: () => 'now()' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'now()' })
  updated_at!: Date;



  serialize() {
    return {
      id: this.id,
      title_en: this.title_en,
      title_pt: this.title_pt,
      slug: this.slug,
      servings: this.servings,
      instructions_md_en: this.instructions_md_en,
      instructions_md_pt: this.instructions_md_pt,
      tags: this.tags,
      kcal_per_serving: this.kcal_per_serving,
      protein_g_per_serving: this.protein_g_per_serving,
      carbs_g_per_serving: this.carbs_g_per_serving,
      fat_g_per_serving: this.fat_g_per_serving,
      created_by_user_id: this.created_by_user_id,
      created_at: this.created_at.toISOString(),
      updated_at: this.updated_at.toISOString(),
    }
  }
}
