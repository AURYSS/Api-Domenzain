import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from "../dto/create-task.dto";

@Injectable()
export class TaskService {
    
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
    ) {}

    public async getTasks(): Promise<Task[]> {
        return await this.taskRepository.find({
            relations: ['user']
        });
    }

    public async getTaskById(id: number): Promise<Task> {
        const task = await this.taskRepository.findOne({
            where: { id },
            relations: ['user']
        });
        if (!task) {
            throw new Error('Task not found');
        }
        return task;
    }

    public async createTask(task: CreateTaskDto): Promise<Task> {
        const newTask = this.taskRepository.create(task);
        return await this.taskRepository.save(newTask);
    }

    public async updateTask(id: number, task: Partial<CreateTaskDto>): Promise<Task> {
        const existingTask = await this.taskRepository.findOne({ where: { id } });
        if (!existingTask) {
            throw new Error('Task not found');
        }
        if (task.name) {
            existingTask.name = task.name;
        }
        if (task.description) {
            existingTask.description = task.description;
        }
        if (task.priority !== undefined) {
            existingTask.priority = task.priority;
        }
        if (task.userId) {
            existingTask.userId = task.userId;
        }
        return await this.taskRepository.save(existingTask);
    }
        
    public async deleteTask(id: number): Promise<boolean> {
        const sql = 'DELETE FROM task WHERE id = ?';
        const result = await this.taskRepository.query(sql, [id]);

        return result.changes > 0;  
        
    }

}