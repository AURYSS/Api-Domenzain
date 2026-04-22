import { Injectable } from "@nestjs/common";
import { PrismaService } from '../../../common/services/prisma.service.js';
import { CreateTaskDto } from "../dto/create-task.dto.js";
import { LogsService } from "../../logs/logs.service.js";

// Custom mapper so frontend doesn't break
function mapPrismaTaskToDto(prismaTask: any) {
  return {
    id: prismaTask.id,
    name: prismaTask.title,
    description: prismaTask.content || "",
    priority: prismaTask.published || false,
    userId: prismaTask.authorId,
    user: prismaTask.author ? {
        id: prismaTask.author.id,
        name: prismaTask.author.name
    } : undefined
  };
}

@Injectable()
export class TaskService {
    constructor(
        private prisma: PrismaService,
        private logsSvc: LogsService
    ) {}

    public async getTasks(userId: number) {
        const tasks = await this.prisma.task.findMany({
            where: { authorId: userId },
            include: { author: true },
            orderBy: { id: "desc" }
        });
        return tasks.map(mapPrismaTaskToDto);
    }

    public async getTaskById(id: number, userId: number) {
        const task = await this.prisma.task.findFirst({
            where: { id, authorId: userId },
            include: { author: true }
        });
        if (!task) {
            throw new Error('Task not found or unauthorized');
        }
        return mapPrismaTaskToDto(task);
    }

    public async createTask(task: CreateTaskDto, userId: number) {
        const newTask = await this.prisma.task.create({
            data: {
                title: task.name,
                content: task.description,
                published: task.priority || false,
                authorId: userId // Forzamos el ID del usuario logueado
            },
            include: { author: true }
        });

        await this.logsSvc.audit('TASK_CREATED', `Nueva tarea creada: ${task.name}`, userId, 200);

        return mapPrismaTaskToDto(newTask);
    }

    public async updateTask(id: number, task: Partial<CreateTaskDto>, userId: number) {
        // Primero verificamos que la tarea exista y pertenezca al usuario
        const existingTask = await this.prisma.task.findFirst({
            where: { id, authorId: userId }
        });
        if (!existingTask) throw new Error('Task not found or unauthorized');

        const updateData: any = {};
        if (task.name !== undefined) updateData.title = task.name;
        if (task.description !== undefined) updateData.content = task.description;
        if (task.priority !== undefined) updateData.published = task.priority;
        // NO permitimos cambiar el authorId mediante updateTask

        const updated = await this.prisma.task.update({
            where: { id },
            data: updateData,
            include: { author: true }
        });
        return mapPrismaTaskToDto(updated);
    }
        
    public async deleteTask(id: number, userId: number): Promise<boolean> {
        // Primero verificamos propiedad
        const existingTask = await this.prisma.task.findFirst({
            where: { id, authorId: userId }
        });
        if (!existingTask) throw new Error('Task not found or unauthorized');

        await this.prisma.task.delete({
            where: { id }
        });

        await this.logsSvc.audit('TASK_DELETED', `Tarea eliminada ID: ${id}`, userId, 300);

        return true;  
    }
}