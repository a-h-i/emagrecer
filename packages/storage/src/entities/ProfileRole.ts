import { Column, Entity, PrimaryColumn } from 'typeorm';


@Entity({
  name: 'profile_role',
})
export class ProfileRole {
  @PrimaryColumn({
    type: 'uuid',
  })
  user_id!: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_admin!: boolean;

  @Column({ type: 'timestamp', default: () => 'now()' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'now()' })
  updated_at!: Date;
}