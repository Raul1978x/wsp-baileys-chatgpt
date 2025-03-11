// src/sessions/dto/create-session.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la sesión es obligatorio' })
  sessionName: string;
}
