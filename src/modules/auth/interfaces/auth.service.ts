import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../common/services/prisma.service.js";
import { User } from "@prisma/client";

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