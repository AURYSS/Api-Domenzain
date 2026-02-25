
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { TaskService } from "./task.service"; 
import { CreateTaskDto } from "../dto/create-task.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Tasks')
@Controller("api/task")
export class TaskController {

    constructor(private readonly taskSvc: TaskService){}

    @Get()
    public async getTasks(): Promise<any[]> {
        return await this.taskSvc.getTasks();
    }

    @Get(":id")
    @ApiOperation({ summary: 'Lista las tareas disponibles' })
    public async getTaskById(@Param("id", ParseIntPipe) id: number): Promise<any> {
        try {
            return await this.taskSvc.getTaskById(id);
        } catch (error) {
            throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
        }
    }

    @Post()
    public async createTask(@Body() task: CreateTaskDto): Promise<any> {
        return await this.taskSvc.createTask(task);
    }

    @Put(":id")
    public async updateTask(@Param("id", ParseIntPipe) id: number, @Body() task: Partial<CreateTaskDto>): Promise<any> {
        try {
            return await this.taskSvc.updateTask(id, task);
        } catch (error) {
            throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
        }
    }

    @Delete(":id")
    public async deleteTask(@Param("id", ParseIntPipe) id: number): Promise<void> {
        try {
            await this.taskSvc.deleteTask(id);
        } catch (error) {
            throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
        }
    }

} 