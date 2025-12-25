/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { RoomService } from './room.service';

@Controller('rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Post()
  async createRoom(@Req() req: Request) {
    const room = await this.roomService.createRoom();
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    return {
      roomId: room.id,
      link: `${baseUrl}/transfer/${room.id}`,
      expiresAt: room.expiresAt,
    };
  }

  @Get(':id')
  async getRoom(@Param('id') id: string) {
    const room = await this.roomService.findRoom(id);
    return { exists: Boolean(room) };
  }
}
