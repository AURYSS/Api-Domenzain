import { IsBoolean, IsNotEmpty, IsString, Max, MaxLength, minLength, MinLength } from "class-validator";

export class CreateTaskDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    name: string;  

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(500)
    description: string;

    @IsBoolean()
    @IsNotEmpty()
    priority: boolean;
}
