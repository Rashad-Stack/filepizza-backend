import { Module } from '@nestjs/common';
import { RoomModule } from './room/room.module';
import { SignalingGateway } from './signaling/signaling.gateway';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [RoomModule],
  providers: [SignalingGateway, PrismaService],
})
export class AppModule {}
