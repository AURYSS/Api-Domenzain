import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(150)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(250)
    lastname: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(200)
    password: string;
}
