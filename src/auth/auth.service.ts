/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registerDto: { email: string; password: string }) {
    const { email, password } = registerDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new UnauthorizedException(
        'El correo electrónico ya está registrado',
      );
    }

    // Crear el usuario con la contraseña hasheada
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return { message: 'Usuario registrado exitosamente' };
  }

  async login(loginDto: { email: string; password: string }) {
    const { email, password } = loginDto;

    // Buscar al usuario por correo electrónico
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar un token JWT
    const payload = { sub: user.id, email: user.email }; // Datos del usuario
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return { accessToken };
  }
}
