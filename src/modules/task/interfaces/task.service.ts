import { Injectable } from "@nestjs/common";
import { PrismaService } from '../../../common/services/prisma.service.js';
import { CreateTaskDto } from "../dto/create-task.dto.js";

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
    constructor(private prisma: PrismaService) {}

    public async getTasks(userId: number) {
        const tasks = await this.prisma.task.findMany({
            where: { authorId: userId },
            include: { author: true },
            orderBy: { id: "desc" }
        });
        return tasks.map(mapPrismaTaskToDto);
    }

    public async getTaskById(id: number) {
        const task = await this.prisma.task.findUnique({
            where: { id },
            include: { author: true }
        });
        if (!task) {
            throw new Error('Task not found');
        }
        return mapPrismaTaskToDto(task);
    }

    public async createTask(task: CreateTaskDto) {
        const newTask = await this.prisma.task.create({
            data: {
                title: task.name,
                content: task.description,
                published: task.priority || false,
                authorId: task.userId
            },
            include: { author: true }
        });
        return mapPrismaTaskToDto(newTask);
    }

    public async updateTask(id: number, task: Partial<CreateTaskDto>) {
        const updateData: any = {};
        if (task.name !== undefined) updateData.title = task.name;
        if (task.description !== undefined) updateData.content = task.description;
        if (task.priority !== undefined) updateData.published = task.priority;
        if (task.userId !== undefined) updateData.authorId = task.userId;

        const updated = await this.prisma.task.update({
            where: { id },
            data: updateData,
            include: { author: true }
        });
        return mapPrismaTaskToDto(updated);
    }
        
    public async deleteTask(id: number): Promise<boolean> {
        await this.prisma.task.delete({
            where: { id }
        });
        return true;  
    }
}