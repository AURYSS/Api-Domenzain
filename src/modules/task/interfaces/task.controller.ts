
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards, Req } from "@nestjs/common";
import { TaskService } from "./task.service.js"; 
import { CreateTaskDto } from "../dto/create-task.dto.js";
import { ApiOperation, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "../../../common/guards/auth.guard.js";

@ApiTags('Tasks')
@ApiBearerAuth('access-token')
@Controller("task")
@UseGuards(AuthGuard)
export class TaskController {

    constructor(private readonly taskSvc: TaskService){}

    @Get()
    public async getTasks(@Req() req: any): Promise<any[]> {
        const userId = req.user.id;
        return await this.taskSvc.getTasks(userId);
    }

    @Get(":id")
    @ApiOperation({ summary: 'Lista las tareas disponibles' })
    public async getTaskById(@Param("id", ParseIntPipe) id: number, @Req() req: any): Promise<any> {
        try {
            const userId = req.user.id;
            return await this.taskSvc.getTaskById(id, userId);
        } catch (error) {
            throw new HttpException('Task not found or unauthorized', HttpStatus.NOT_FOUND);
        }
    }

    @Post()
    public async createTask(@Body() task: CreateTaskDto, @Req() req: any): Promise<any> {
        const userId = req.user.id;
        return await this.taskSvc.createTask(task, userId);
    }

    @Put(":id")
    public async updateTask(@Param("id", ParseIntPipe) id: number, @Body() task: Partial<CreateTaskDto>, @Req() req: any): Promise<any> {
        try {
            const userId = req.user.id;
            return await this.taskSvc.updateTask(id, task, userId);
        } catch (error) {
            throw new HttpException('Task not found or unauthorized', HttpStatus.NOT_FOUND);
        }
    }

    @Delete(":id")
    public async deleteTask(@Param("id", ParseIntPipe) id: number, @Req() req: any): Promise<void> {
        try {
            const userId = req.user.id;
            await this.taskSvc.deleteTask(id, userId);
        } catch (error) {
            throw new HttpException('Task not found or unauthorized', HttpStatus.NOT_FOUND);
        }
    }

} 