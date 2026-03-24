import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/services/prisma.service.js";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {

    constructor(private readonly prisma: PrismaService ) {}
    
    public async getUserByUsername(username: string): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: { username }
        });
    }

    public login(): string {
        return "Sesion exitosa"; 
    }
}