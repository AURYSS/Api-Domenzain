import { Body, Controller, Get, HttpCode, HttpStatus, Post, UnauthorizedException, UseGuards, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { ApiOperation, ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthDto } from "../dto/auth.dto.js";
import { RegisterDto } from "../dto/register.dto.js";
import { RegisterResponseDto } from "../dto/register-response.dto.js";
import { LoginResponseDto } from "../dto/login-response.dto.js";
import { ProfileDto } from "../dto/profile.dto.js";
import { UtilService } from "../../../common/services/util.service.js";
import { AuthGuard } from "../../../common/guards/auth.guard.js";
import * as bcrypt from 'bcrypt';
import type { Request, Response } from 'express';

@ApiTags('Auth')
@Controller("auth")
export class AuthController {

  constructor(
    private readonly authSvc: AuthService,
    private readonly utilSvc: UtilService
  ) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Registra un nuevo usuario en la base de datos" })
  public async register(@Body() registerDto: RegisterDto): Promise<RegisterResponseDto> {
    const user = await this.authSvc.register(registerDto);
    return {
      message: "Usuario registrado con éxito",
      userId: user.id
    };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verifica credenciales y coloca JWT en Cookies HTTP-Only" })
  public async login(@Body() auth: AuthDto, @Res({ passthrough: true }) res: Response): Promise<LoginResponseDto> {
    const user = await this.authSvc.getUserByUsername(auth.username);

    let isPasswordValid = false;
    if (user) {
      if (user.password === auth.password) {
          isPasswordValid = true;
      } else {
          try {
              isPasswordValid = await bcrypt.compare(auth.password, user.password);
          } catch (e) {
              isPasswordValid = false;
          }
      }
    }

    if (user && isPasswordValid) {
      const payload = { id: user.id, username: user.username, role: user.role.name };

      const refresh = await this.utilSvc.generateJWT(payload, '7d');
      const hashRT = await this.utilSvc.hash(refresh);
      await this.authSvc.updateHash(payload.id, hashRT);

      const jwt = await this.utilSvc.generateJWT(payload,'1h');

      res.cookie('access_token', jwt, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 3600000 });
      res.cookie('refresh_token', refresh, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 3600000 });

      return { success: true, message: 'Logged in successfully' };
    } else {
      throw new UnauthorizedException('El usuario y/o contrasena es incorrecta');
    }
  }

  @Get("me")
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "Valida la sesión usando cookies y retorna el perfil" })
  public async getProfile(@Req() request: any): Promise<ProfileDto> {
    // request['user'] contiene el payload del JWT: { id, username, role }
    return {
      id: request['user'].id,
      username: request['user'].username,
      role: request['user'].role
    };
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Genera nuevos JWT mediante Cookie de refresh token" })
  public async refreshToken(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = request.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const payload = await this.utilSvc.getPayload(refreshToken);
      const user = await this.authSvc.getUserById(payload.id);
      
      if (!user || !user.hash) throw new UnauthorizedException('User not found or session invalidated');

      const isMatch = await bcrypt.compare(refreshToken, user.hash);
      if (!isMatch) throw new UnauthorizedException('Invalid refresh token');

      const newPayload = { id: user.id, username: user.username, role: user.role.name };
      const newAccessToken = await this.utilSvc.generateJWT(newPayload, '1h');
      const newRefreshToken = await this.utilSvc.generateJWT(newPayload, '7d');
      const newHash = await this.utilSvc.hash(newRefreshToken);

      await this.authSvc.updateHash(user.id, newHash);

      res.cookie('access_token', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 3600000 });
      res.cookie('refresh_token', newRefreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 3600000 });

      return { success: true, message: 'Tokens refreshed successfully' };
    } catch (e) {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Destruye la sesión de base de datos y borra las cookies sin importar el estado" })
  public async logout(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const token = request.cookies?.access_token;
    if (token) {
      try {
          const payload = await this.utilSvc.getPayload(token);
          if (payload && payload.id) {
              await this.authSvc.updateHash(payload.id, null);
          }
      } catch (e) {
          // Si el token estaba corrupto, lo ignoramos, la meta es borrar las cookies.
      }
    }

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { success: true };
  }
}