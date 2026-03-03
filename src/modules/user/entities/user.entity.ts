import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import type { Task } from '../../task/entities/task.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 400, nullable: true })
  lastname: string;

  @OneToMany(() => (globalThis as any).Task as typeof Task, task => task.user)
  tasks: Task[];
}

// expose for circular relation resolution at runtime
(globalThis as any).User = User;