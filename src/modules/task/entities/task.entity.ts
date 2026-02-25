import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('task')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 250 })
  description: string;

  @Column({ type: 'boolean', nullable: true })
  priority: boolean;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, user => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user: User;
}