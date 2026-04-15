import { Controller, Get, Delete, Param, UseGuards, HttpCode, HttpStatus } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { AdminGuard } from "../../../common/guards/admin.guard.js";
import { ApiOperation, ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('Users')
@Controller("user")
export class UserController {
    constructor(private readonly userSvc: UserService) {}

    @Get()
    @UseGuards(AdminGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: "Lista todos los usuarios (Solo Admin)" })
    public async getUsers() {
        return await this.userSvc.getUsers();
    }

    @Delete(":id")
    @UseGuards(AdminGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: "Elimina un usuario si no tiene tareas (Solo Admin)" })
    public async deleteUser(@Param("id") id: string) {
        return await this.userSvc.deleteUser(Number(id));
    }
}
