import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO para respuesta pública de usuario
 * Usado cuando se expone información de otros usuarios
 * No incluye: password, hash, email/username
 */
export class UserPublicDto {
  @ApiProperty({ example: 1, description: "ID del usuario" })
  id!: number;

  @ApiProperty({ example: "Juan", description: "Nombre del usuario" })
  name!: string;

  @ApiProperty({ example: "Pérez", description: "Apellido del usuario", required: false })
  lastname?: string;

  @ApiProperty({ example: "juan_perez", description: "Nombre de usuario único" })
  username!: string;

  @ApiProperty({ example: "user", description: "Rol del usuario" })
  role!: string;

  @ApiProperty({ example: "2026-01-15T10:30:00Z", description: "Fecha de creación" })
  created_at!: Date;

  @ApiProperty({ example: 5, description: "Cantidad de tareas" })
  task_count?: number;
}
