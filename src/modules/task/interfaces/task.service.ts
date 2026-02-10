import { Injectable } from "@nestjs/common";

@Injectable()
export class TaskService {
    
    public getTask (): string{
        return "Listado de tareas"; 
    }

    public getTaskById (id: number): string{
        return `Se obtiene la tarea ${id}`;

    }
    public insertTask (task: any): any{
        return task;
    }
    public updateTask (id: number, task: any): any{
        return task;
    }
    public deleteTask (id: number): string{
        return `Eliminando la tarea ${id}`;
    }

}