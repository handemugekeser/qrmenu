import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto, UpdateBusinessDto } from './business.dto';
import { PLAN_LIMITS } from '../common/plan-limits.constants';

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBusinessDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
    const limits = PLAN_LIMITS[user.plan];
    if (limits.maxBusinesses !== -1) {
      const count = await this.prisma.business.count({ where: { userId } });
      if (count >= limits.maxBusinesses) {
        throw new ForbiddenException(
          `Plan limitine ulaştınız. ${user.plan === 'FREE' ? 'Pro' : 'Premium'} aboneliğe geçerek daha fazla işletme ekleyebilirsiniz.`,
        );
      }
    }

    const slugTaken = await this.prisma.business.findUnique({ where: { slug: dto.slug } });
    if (slugTaken) throw new ConflictException('This slug is already taken');

    return this.prisma.business.create({
      data: { ...dto, userId },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.business.findMany({
      where: { userId },
      include: {
        menus: { select: { id: true, name: true, isActive: true } },
        _count: { select: { menus: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const business = await this.prisma.business.findFirst({
      where: { id, userId },
      include: {
        menus: {
          include: {
            _count: { select: { categories: true, qrCodes: true } },
          },
        },
      },
    });
    if (!business) throw new NotFoundException('Business not found');
    return business;
  }

  async update(id: string, userId: string, dto: UpdateBusinessDto) {
    await this.checkOwnership(id, userId);
    return this.prisma.business.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    await this.checkOwnership(id, userId);
    await this.prisma.business.delete({ where: { id } });
    return { message: 'Business deleted' };
  }

  async checkSlugAvailability(slug: string) {
    const exists = await this.prisma.business.findUnique({ where: { slug } });
    return { available: !exists };
  }

  private async checkOwnership(id: string, userId: string) {
    const business = await this.prisma.business.findFirst({ where: { id, userId } });
    if (!business) throw new NotFoundException('Business not found');
    return business;
  }
}
