import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

@Module({
    imports: [AuthModule],
    controllers: [AuthController],
    providers: [AuthService] 
})
export class AuthModule {}