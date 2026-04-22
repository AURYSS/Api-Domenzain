import { Controller, Get, Delete, Param, UseGuards, HttpCode, HttpStatus, Body, Post, Patch, Req } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { AdminGuard } from "../../../common/guards/admin.guard.js";
import { AuthGuard } from "../../../common/guards/auth.guard.js";
import { ApiOperation, ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserPublicDto } from "../dto/user-public.dto.js";

@ApiTags('Users')
@Controller("user")
export class UserController {
    constructor(private readonly userSvc: UserService) {}

    @Get()
    @UseGuards(AdminGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: "Lista todos los usuarios (Solo Admin)" })
    public async getUsers(): Promise<UserPublicDto[]> {
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

    @Post()
    @UseGuards(AdminGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: "Crea un nuevo usuario (Solo Admin)" })
    public async createUser(@Body() data: any) {
        return await this.userSvc.createUser(data);
    }

    @Patch(":id")
    @UseGuards(AdminGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: "Actualiza un usuario (Solo Admin)" })
    public async updateUser(@Param("id") id: string, @Body() data: any) {
        return await this.userSvc.updateUser(Number(id), data);
    }

    @Patch("profile/:id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: "Actualiza el propio perfil (Protección IDOR)" })
    public async updateProfile(@Param("id") id: string, @Body() data: any, @Req() req: any) {
        const requesterId = req.user.id;
        return await this.userSvc.updateOwnProfile(Number(id), requesterId, data);
    }
}
