import { Module } from "@nestjs/common";
import { UserController } from "./user.controller.js";
import { UserService } from "./user.service.js";
import { PrismaService } from "../../../common/services/prisma.service.js";
import { UtilService } from "../../../common/services/util.service.js";
import { AdminGuard } from "../../../common/guards/admin.guard.js";

@Module({
    controllers: [UserController],
    providers: [UserService, PrismaService, UtilService, AdminGuard],
    exports: [UserService]
})
export class UserModule {}
