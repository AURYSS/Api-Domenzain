import { Injectable, ConflictException } from "@nestjs/common";
import { PrismaService } from "../../../common/services/prisma.service.js";
import { User } from "@prisma/client";
import { RegisterDto } from "../dto/register.dto.js";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(private readonly prisma: PrismaService ) {}
    
    public async getUserByUsername(username: string): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: { username }
        });
    }

    public async getUserById(id: number): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: { id }
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