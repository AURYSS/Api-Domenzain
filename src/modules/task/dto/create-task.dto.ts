import { IsBoolean, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTaskDto {

    name: string;  

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(500)
    description: string;

    @IsBoolean()
    priority: boolean;

    userId: number;
}
