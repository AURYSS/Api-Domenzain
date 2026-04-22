import { IsNotEmpty, IsString, MaxLength, MinLength, IsOptional, IsIn } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ example: "Juan" })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(150)
    name: string;

    @ApiProperty({ example: "Pérez" })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(250)
    lastname: string;

    @ApiProperty({ example: "juan_perez" })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    username: string;

    @ApiProperty({ example: "Password123!" })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(200)
    password: string;

    @ApiProperty({ example: "user", enum: ["admin", "user"] })
    @IsString()
    @IsOptional()
    @IsIn(["admin", "user"])
    role?: string;
}
