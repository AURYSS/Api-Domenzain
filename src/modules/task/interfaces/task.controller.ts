
import { Controller, Get } from "@nestjs/common";
import { TaskService } from "./task.service"; 

@Controller("api/task")
export class TaskController {

    constructor(private readonly taskSvc: TaskService){}

    @Get("login")
    public login(): string {
        return this.taskSvc.login();
    }
} 