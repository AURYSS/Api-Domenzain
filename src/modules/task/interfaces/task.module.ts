import { Module } from "@nestjs/common";
import { TaskController } from "./task.controller.js";
import { TaskService } from "./task.service.js";
import { AuthModule } from '../../auth/interfaces/auth.module.js';
import { PrismaService } from '../../../common/services/prisma.service.js';

@Module({
    imports: [AuthModule],
    controllers: [TaskController],
    providers: [TaskService, PrismaService]
})
export class TaskModule {}