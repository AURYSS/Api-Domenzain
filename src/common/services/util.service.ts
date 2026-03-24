import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UtilService {

    constructor(private jwtSvc: JwtService) {}

    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    public async checkPassword(password: string, encryptedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, encryptedPassword);
    }

    public async generateJWT(payload: any, expiresIn: string | number = '60s'): Promise<string> {
        return await this.jwtSvc.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: expiresIn
        });
    }

    public async getPayload(jwt: string): Promise<any> {
        return await this.jwtSvc.verifyAsync(jwt, {
            secret: process.env.JWT_SECRET
        });
    }
}