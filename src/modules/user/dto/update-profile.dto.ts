import { IsString, MaxLength, MinLength, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateProfileDto {
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

    @ApiPropertyOptional({ example: "NewPassword123!" })
    @IsString()
    @IsOptional()
    @MinLength(8)
    @MaxLength(200)
    password?: string;
}
