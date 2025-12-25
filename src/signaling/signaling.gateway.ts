import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { RoomService } from '../room/room.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SignalingGateway implements OnGatewayDisconnect {
  private rooms = new Map<string, { sender?: string; receivers: string[] }>();

  constructor(private roomService: RoomService) {}

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string; role: 'sender' | 'receiver' },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, role } = data;
    
    const room = await this.roomService.findRoom(roomId);
    if (!room) {
      client.emit('error', 'Room not found or expired');
      return;
    }

    client.join(roomId);
    (client as any).roomId = roomId;
    (client as any).role = role;

    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, { receivers: [] });
    }

    const roomData = this.rooms.get(roomId);

    if (role === 'sender') {
      roomData.sender = client.id;
      client.emit('room-joined', { role: 'sender' });
    } else {
      roomData.receivers.push(client.id);
      client.emit('room-joined', { role: 'receiver' });
      
      if (roomData.sender) {
        client.to(roomData.sender).emit('receiver-joined', { receiverId: client.id });
      }
    }
  }

  @SubscribeMessage('offer')
  handleOffer(
    @MessageBody() data: { offer: any; targetId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.targetId).emit('offer', {
      offer: data.offer,
      senderId: client.id,
    });
  }

  @SubscribeMessage('answer')
  handleAnswer(
    @MessageBody() data: { answer: any; targetId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.targetId).emit('answer', {
      answer: data.answer,
      senderId: client.id,
    });
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(
    @MessageBody() data: { candidate: any; targetId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.targetId).emit('ice-candidate', {
      candidate: data.candidate,
      senderId: client.id,
    });
  }

  handleDisconnect(client: Socket) {
    const clientData = client as any;
    const { roomId, role } = clientData;

    if (roomId && this.rooms.has(roomId)) {
      const room = this.rooms.get(roomId);
      
      if (role === 'sender') {
        room.sender = undefined;
      } else {
        room.receivers = room.receivers.filter(id => id !== client.id);
      }

      if (!room.sender && room.receivers.length === 0) {
        this.rooms.delete(roomId);
        this.roomService.deactivateRoom(roomId);
      }
    }
  }
}
