import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from "./task.controller.js";
import { TaskService } from "./task.service.js";
import { Task } from '../entities/task.entity.js';
import { AuthModule } from '../../auth/interfaces/auth.module.js';

@Module({
    imports: [TypeOrmModule.forFeature([Task]), AuthModule],
    controllers: [TaskController],
    providers: [TaskService]
})
export class TaskModule {}