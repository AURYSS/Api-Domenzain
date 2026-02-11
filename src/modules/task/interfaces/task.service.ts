import { Injectable } from "@nestjs/common";
import { callbackify } from "util";
import { CreateTaskDto } from "../dto/create-task.dto";

@Injectable()
export class TaskService {
    
    private tasks: any[] = [];

    public getTask (): any[]{
        return this.tasks; 
    }

    public getTaskById (id: number): any{
        var task = this.tasks.filter((data) => data.id === id);
        return task;

    }
    public insertTask (task: CreateTaskDto): any{
        var id = this.tasks.length + 1;
        var position = this.tasks.push({...task, id});
        //task.id = id;
        return this.tasks [position - 1];
    }

    public updateTask (id: number, task: any): any{
        const taskupdate = this.tasks.map((data) => {
            if(data.id === id){

                if(task.name) data.name = task.name;
                if(task.description) data.description = task.description;
                if (task.priority != null) data.priority = task.priority;

                console.log("Task", task.priority);
                console.log("Store", data);

                return data;
            } 
    });
        return taskupdate;
    }
        
    public deleteTask (id: number): string{
        const array = this.tasks.filter(data => data.id != id);

        return `Task Deleted`;
    }

}