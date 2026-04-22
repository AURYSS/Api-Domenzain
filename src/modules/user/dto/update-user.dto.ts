import { IsString, MaxLength, MinLength, IsOptional, IsIn } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateUserDto {
    @ApiPropertyOptional({ example: "Juan" })
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(150)
    name?: string;

    @ApiPropertyOptional({ example: "Pérez" })
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(250)
    lastname?: string;

    @ApiPropertyOptional({ example: "juan_perez" })
    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(100)
    username?: string;

    @ApiPropertyOptional({ example: "NewPassword123!" })
    @IsString()
    @IsOptional()
    @MinLength(8)
    @MaxLength(200)
    password?: string;

    @ApiPropertyOptional({ example: "admin", enum: ["admin", "user"] })
    @IsString()
    @IsOptional()
    @IsIn(["admin", "user"])
    role?: string;
}
