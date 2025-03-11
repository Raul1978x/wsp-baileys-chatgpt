// src/sessions/dto/update-session.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class UpdateSessionDto {
  @IsString()
  @IsOptional()
  sessionName?: string;

  @IsOptional()
  isActive?: boolean;
}
