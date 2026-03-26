import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import { User } from "../../user/entities/user.entity.js";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "../../../common/services/prisma.service.js";
import { UtilService } from "../../../common/services/util.service.js";
import { AuthGuard } from "../../../common/guards/auth.guard.js";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "60s" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UtilService, AuthGuard],
  exports: [AuthService, AuthGuard, UtilService],
})
export class AuthModule {} 