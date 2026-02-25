import { IsAlpha, IsBoolean, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateTaskDto {
    
        @IsString({message: 'Debe ser una cadena'})
        @MinLength(3,{message: 'Debe tener al menos 3 caracteres'}) 

        @MaxLength(100)
        name: string;

        @IsOptional()
        @IsString({message: 'Debe ser una cadena'})
        @MinLength(3,{message: 'Debe tener al menos 3 caracteres'})
        @MaxLength(500)
        description: string;

        @IsOptional()   
        @IsBoolean()
        priority: boolean;

}