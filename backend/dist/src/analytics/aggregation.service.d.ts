import { PrismaService } from '../prisma/prisma.service';
export declare class AggregationService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    generateDailySnapshots(targetDate?: Date): Promise<{
        date: string;
        businesses: number;
    }>;
    private buildSnapshotFor;
}
