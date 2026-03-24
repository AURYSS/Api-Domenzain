import { IsNotEmpty, IsString, MaxLength, Min, MinLength } from "class-validator";

export class AuthDto {

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
