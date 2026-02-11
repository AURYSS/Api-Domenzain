
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { TaskService } from "./task.service"; 
import { parse } from "path";

@Controller("api/task")
export class TaskController {

    constructor(private readonly taskSvc: TaskService){}

        //! http:localhost:3000/api/task

    @Get()
    public getTask(): any []{
        return this.taskSvc.getTask();
    }

        //! GET http:localhost:3000/api/task/1
    @Get(":id")
    public getTaskById( @Param("id", ParseIntPipe) id: number): any {
        var task = this.taskSvc.getTaskById(id);

        if(task ) return task;
        else throw new HttpException('Task not found', HttpStatus.NOT_FOUND); 
    }

            //! POST GET http:localhost:3000/api/task
    @Post()
    public insertTask(@Body() task: any): any {
        return this.taskSvc.insertTask(task);
    }

                //! PUT http:localhost:3000/api/task/:id
    @Put(":id")
    public updateTask(@Param("id",ParseIntPipe) id: number,@Body() task: any): any {
        return this.taskSvc.updateTask(id, task);
    }

                    //! DELETE http:localhost:3000/api/task/:id
    @Delete(":id")
    public deleteTask(@Param("id", ParseIntPipe) id: number){
        return this.taskSvc.deleteTask(id);
    }

} 