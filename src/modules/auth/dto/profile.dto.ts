import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO para perfil de usuario autenticado
 * Retornado por el endpoint GET /auth/me
 * Contiene información privada del usuario propietario
 */
export class ProfileDto {
  @ApiProperty({ example: 1, description: "ID del usuario" })
  id!: number;

  @ApiProperty({ example: "juan_perez", description: "Nombre de usuario único" })
  username!: string;

  @ApiProperty({ example: "admin", description: "Rol del usuario (admin, user, etc)" })
  role!: string;

  @ApiProperty({ example: "Juan", description: "Nombre del usuario", required: false })
  name?: string;

  @ApiProperty({ example: "Pérez", description: "Apellido del usuario", required: false })
  lastname?: string;
}
