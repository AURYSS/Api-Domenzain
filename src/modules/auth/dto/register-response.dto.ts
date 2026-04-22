import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO para respuesta de registro
 * Solo expone el ID del usuario creado
 */
export class RegisterResponseDto {
  @ApiProperty({ example: 1, description: "ID del nuevo usuario" })
  userId: number;

  @ApiProperty({ example: "Usuario registrado con éxito", description: "Mensaje de confirmación" })
  message: string;
}
