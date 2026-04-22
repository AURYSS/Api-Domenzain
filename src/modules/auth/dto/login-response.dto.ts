import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO para respuesta de login
 * Confirmación sin datos sensibles
 */
export class LoginResponseDto {
  @ApiProperty({ example: true, description: "Indicador de éxito" })
  success!: boolean;

  @ApiProperty({ example: "Logged in successfully", description: "Mensaje de confirmación" })
  message!: string;
}
