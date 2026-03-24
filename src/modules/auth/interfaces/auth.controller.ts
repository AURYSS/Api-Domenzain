import { Body, Controller, Get, HttpCode, HttpStatus, Post, UnauthorizedException, UseGuards, Req } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { ApiOperation } from "@nestjs/swagger";
import { AuthDto } from "../dto/auth.dto.js";
import { JwtService } from "@nestjs/jwt";
import { UtilService } from "src/common/services/util.service.js";


@Controller("auth")
export class AuthController {

  constructor(
    private readonly authSvc: AuthService,
    private readonly utilSvc: UtilService
  ) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verifica las credenciales y genera un JWT" })

  public async login(@Body() auth: AuthDto): Promise<string> {
    const { username, password } = auth;

    const user = await this.authSvc.getUserByUsername(username);

    if (!user) {
      throw new UnauthorizedException("El usuario y/o contraseña es incorrecto");
    }

    const isValid = await this.utilSvc.checkPassword(password, user.password!);

    if (!isValid) {
      throw new UnauthorizedException("El usuario y/o contraseña es incorrecto");
    }

    const { password: userPassword, ...payload } = user;

    const jwt = await this.utilSvc.generateJWT(payload, "60s");

    return jwt;
  }

  @Get("me")
  @UseGuards()
  @ApiOperation({ summary: "Extrae el ID del usuario desde el token y busca la informacion" })
  public async getProfile(@Req() request: any) {
    const user = request['user']
    return user;
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Genera un nuevo JWT usando el mismo payload del token actual" })
  public async refreshToken() {
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Invalida el token actual (simulado)" })
  public async logout() {
  }
}