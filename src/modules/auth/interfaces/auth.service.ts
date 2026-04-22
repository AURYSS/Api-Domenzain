import { Injectable, ConflictException } from "@nestjs/common";
import { PrismaService } from "../../../common/services/prisma.service.js";
import { User } from "@prisma/client";
import { RegisterDto } from "../dto/register.dto.js";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(private readonly prisma: PrismaService ) {}
    
    /**
     * Método interno: Obtiene usuario con todos sus datos (incluyendo contraseña)
     * Solo usar en contextos internos de autenticación
     */
    public async getUserByUsername(username: string): Promise<any | null> {
        return await (this.prisma.user as any).findFirst({
            where: { username },
            include: { role: true }
        });
    }

    /**
     * Método interno: Obtiene usuario por ID con todos sus datos (incluyendo contraseña)
     * Solo usar en contextos internos de autenticación
     */
    public async getUserById(id: number): Promise<any | null> {
        return await (this.prisma.user as any).findFirst({
            where: { id },
            include: { role: true }
        });
    }

    public async register(data: RegisterDto): Promise<User> {
        const existingUser = await this.getUserByUsername(data.username);
        if (existingUser) {
            throw new ConflictException("El nombre de usuario ya está en uso");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        return await this.prisma.user.create({
            data: {
                name: data.name,
                lastname: data.lastname,
                username: data.username,
                password: hashedPassword,
            }
        });
    }

    public async updateHash(user_id: number, hash:string | null){
        return await this.prisma.user.update({
            where: {id: user_id},
            data: {hash}
        });
    }

    public logIn(): string {
        return "Sesion exitosa"; 
    }
}