import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async createRoom() {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    return this.prisma.room.create({
      data: {
        expiresAt,
      },
    });
  }

  async findRoom(id: string) {
    return this.prisma.room.findFirst({
      where: {
        id,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }

  async deactivateRoom(id: string) {
    return this.prisma.room.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
