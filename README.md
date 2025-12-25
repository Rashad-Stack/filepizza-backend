# FilePizza Backend

A peer-to-peer file sharing backend built with NestJS, WebRTC, and PostgreSQL. Inspired by FilePizza, this backend enables direct browser-to-browser file transfers without storing files on servers.

## Features

- 🔄 **Peer-to-peer file transfers** via WebRTC
- 🚀 **Real-time signaling** with WebSocket
- 🗄️ **PostgreSQL database** with Prisma ORM
- ⚡ **Built with Bun** for fast package management
- 🔒 **Secure transfers** - files never touch the server
- ⏰ **Room expiration** - automatic cleanup after 24 hours

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma
- **WebSocket**: Socket.IO
- **Package Manager**: Bun
- **Language**: TypeScript

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd filepizza-backend

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Update DATABASE_URL in .env

# Run database migrations
bunx prisma migrate dev --name init
bunx prisma generate
```

## Environment Variables

```env
DATABASE_URL="postgresql://username:password@localhost:5432/filepizza"
```

## Running the Application

```bash
# Development mode
bun run start:dev

# Production mode
bun run start:prod

# Watch mode
bun run start
```

The server will start on `http://localhost:3000`

## API Documentation

### REST Endpoints

#### Create Transfer Room
```http
POST /rooms
```

**Response:**
```json
{
  "roomId": "uuid-string",
  "link": "http://localhost:3000/transfer/uuid-string",
  "expiresAt": "2024-12-26T06:48:00.000Z"
}
```

#### Check Room Status
```http
GET /rooms/:roomId
```

**Response:**
```json
{
  "exists": true
}
```

### WebSocket Events

Connect to WebSocket at `ws://localhost:3000`

#### Join Room
```javascript
socket.emit('join-room', {
  roomId: 'uuid-string',
  role: 'sender' | 'receiver'
});
```

**Response:**
```javascript
socket.on('room-joined', { role: 'sender' | 'receiver' });
socket.on('receiver-joined', { receiverId: 'socket-id' });
socket.on('error', 'Room not found or expired');
```

#### WebRTC Signaling

**Send Offer:**
```javascript
socket.emit('offer', {
  offer: rtcSessionDescription,
  targetId: 'socket-id'
});
```

**Send Answer:**
```javascript
socket.emit('answer', {
  answer: rtcSessionDescription,
  targetId: 'socket-id'
});
```

**Send ICE Candidate:**
```javascript
socket.emit('ice-candidate', {
  candidate: rtcIceCandidate,
  targetId: 'socket-id'
});
```

**Receive Events:**
```javascript
socket.on('offer', ({ offer, senderId }) => {
  // Handle WebRTC offer
});

socket.on('answer', ({ answer, senderId }) => {
  // Handle WebRTC answer
});

socket.on('ice-candidate', ({ candidate, senderId }) => {
  // Handle ICE candidate
});
```

## Database Schema

```sql
model Room {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  expiresAt DateTime
  isActive  Boolean  @default(true)
}
```

## Architecture

1. **Client creates room** → POST `/rooms` → Returns room ID and shareable link
2. **Sender joins room** → WebSocket `join-room` with role 'sender'
3. **Receiver opens link** → WebSocket `join-room` with role 'receiver'
4. **WebRTC handshake** → Server facilitates offer/answer/ICE candidate exchange
5. **Direct transfer** → Files transfer directly between browsers via WebRTC data channels
6. **Auto cleanup** → Rooms expire after 24 hours

## Development

```bash
# Generate Prisma client after schema changes
bunx prisma generate

# Create new migration
bunx prisma migrate dev --name migration_name

# View database
bunx prisma studio
```

## Testing

```bash
# Unit tests
bun run test

# E2E tests
bun run test:e2e

# Test coverage
bun run test:cov
```

## License

MIT
