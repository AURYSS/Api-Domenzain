
import { Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { TaskService } from "./task.service"; 
import { parse } from "path";

@Controller("api/task")
export class TaskController {

    constructor(private readonly taskSvc: TaskService){}

        //! http:localhost:3000/api/task

    @Get()
    public getTask(): any {
        return this.taskSvc.getTask();
    }

        //! GET http:localhost:3000/api/task/1
    @Get(":id")
    public getTaskById( @Param("id") id: string): any {
        return this.taskSvc.getTaskById(parseInt(id));
    }

            //! POST http:localhost:3000/api/task
    @Post()
    public insertTask(task: any): any {
        return this.taskSvc.insertTask(task);
    }

                //! PUT http:localhost:3000/api/task/:id
    @Put(":id")
    public updateTask(id: number, task: any): any {
        return this.taskSvc.updateTask(id, task);
    }

                    //! DELETE http:localhost:3000/api/task/:id
    @Delete(":id")
    public deleteTask(id: number): any {
        return this.taskSvc.deleteTask(id);
    }
} 