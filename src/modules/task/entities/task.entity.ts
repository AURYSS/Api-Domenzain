import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { User } from '../../user/entities/user.entity.js';

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

  @ManyToOne(() => (globalThis as any).User as typeof User, user => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user: User;

}

// expose for circular relation resolution at runtime
(globalThis as any).Task = Task;