/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Param, Render } from '@nestjs/common';
import { RoomService } from './room/room.service';

@Controller()
export class AppController {
  constructor(private roomService: RoomService) {}

  @Get()
  @Render('index')
  getHome() {
    return { title: 'Home', roomId: '' };
  }

  @Get('transfer/:id')
  @Render('index')
  async getTransfer(@Param('id') id: string) {
    const room = await this.roomService.findRoom(id);
    if (!room) {
      return { title: 'Room Not Found', roomId: '', error: 'Room not found or expired' };
    }
    return { title: 'Transfer', roomId: id };
  }
}
