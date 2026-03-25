import { Body, Controller, Get, HttpCode, HttpStatus, Post, UnauthorizedException, UseGuards, Req, Param } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { ApiOperation } from "@nestjs/swagger";
import { AuthDto } from "../dto/auth.dto.js";
import { JwtService } from "@nestjs/jwt";
import { UtilService } from "src/common/services/util.service.js";
import { AppException } from "src/common/exceptions/app.exception.js";
import { request } from "node:http";
import { AuthGuard } from "src/common/guards/auth.guard.js";


@Controller("auth")
export class AuthController {

  constructor(
    private readonly authSvc: AuthService,
    private readonly utilSvc: UtilService
  ) {}

@Post("login")
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: "Verifica las credenciales y genera un JWT" })
public async login(@Body() auth: AuthDto): Promise<any> {

  const user = await this.authSvc.getUserByUsername(auth.username);

  if (user && user.password === auth.password) {

    const payload = {
      id: user.id,
      username: user.username,
    };


    //Generar refresh token por 7d 
    const refresh = await this.utilSvc.generateJWT(payload, '7d');
    const hashRT = await this.utilSvc.hash(refresh);

    await this.authSvc.updateHash(payload.id, hashRT)

    //Generar token de acceso por 1h
    const jwt = await this.utilSvc.generateJWT(payload,'1h');

    return {
      access_token: jwt,
      refresh_token: refresh,
    };

  } else {
    throw new UnauthorizedException('El usuario y/o contrasena es incorrecta');
  }
}

  @Get("me")
  @UseGuards()
  @ApiOperation({ summary: "Extrae el ID del usuario desde el token y busca la informacion" })
  public async getProfile(@Req() request: any) {
    const user = request['user']
    return user;
  }

  @Post("refresh/:refresh-token")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Genera un nuevo JWT usando el mismo payload del token actual" })
  public async refreshToken(@Req() request: any) {

    //Obtener el usuario en sesion 
    const userSession = request['user'];
    const user = await this.authSvc.getUserById(userSession.id);

    if (!user || user.hash) throw new AppException('Acceso denegado', HttpStatus.FORBIDDEN, '0');

    console.log(userSession.hash);
    console.log(user.hash)
    // TODO: Comprarar el token recibido con el token guardado
    if (userSession.hash != user.hash) throw new AppException('Acceso denegado', HttpStatus.FORBIDDEN, '0')

    // TODO: Si el token es valido se generan nuevos tokens
    return{
      token: '',
      refreshToken: ''
    }
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Invalida el token actual (simulado)" })
  public async logout(@Req() request: any) {
    const sesion = request['user'];
    const user = await this.authSvc.updateHash(sesion.id, null);
    return user;
  }
}