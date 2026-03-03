import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from "./task.controller.js";
import { TaskService } from "./task.service.js";
import { Task } from '../entities/task.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([Task])],
    controllers: [TaskController],
    providers: [TaskService]
})
export class TaskModule {}