import { IsBoolean, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(150)
    name: string;  

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(500)
    description: string;

    @IsBoolean()
    priority: boolean;
    @IsNumber()
    @IsNotEmpty()
    userId: number;
}
