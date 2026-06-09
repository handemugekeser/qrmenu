import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './auth.dto';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            plan: import(".prisma/client").$Enums.SubscriptionPlan;
        };
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            plan: import(".prisma/client").$Enums.SubscriptionPlan;
            planExpiresAt: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        planExpiresAt: Date;
        createdAt: Date;
        businesses: {
            id: string;
            name: string;
            slug: string;
            logoUrl: string;
        }[];
    }>;
    private signToken;
}
