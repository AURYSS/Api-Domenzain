import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import { User } from '../../user/entities/user.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}