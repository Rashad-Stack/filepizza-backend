import { Module } from '@nestjs/common';
import { RoomModule } from './room/room.module';
import { SignalingGateway } from './signaling/signaling.gateway';
import { PrismaService } from './prisma/prisma.service';
import { AppController } from './app.controller';

@Module({
  imports: [RoomModule],
  controllers: [AppController],
  providers: [SignalingGateway, PrismaService],
})
export class AppModule {}
