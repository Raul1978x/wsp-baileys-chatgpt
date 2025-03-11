// src/users/dto/update-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe Updated',
    description: 'Nuevo nombre del usuario',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'nuevo-usuario@example.com',
    description: 'Nuevo correo electrónico del usuario',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'nueva-contraseña123',
    description: 'Nueva contraseña del usuario',
  })
  @IsString()
  @IsOptional()
  password?: string;
}
