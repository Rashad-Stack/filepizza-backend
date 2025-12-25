# FilePizza Backend

A peer-to-peer file sharing application built with NestJS, WebRTC, and PostgreSQL. Enables direct browser-to-browser file transfers without storing files on servers.

## 🚀 Features

- 🔄 **Peer-to-peer file transfers** via WebRTC data channels
- 📁 **Any file type & size** - Chunked transfer for large files (ZIP, videos, etc.)
- 🚀 **Real-time signaling** with WebSocket (Socket.IO)
- 🗄️ **PostgreSQL database** with Prisma ORM
- ⚡ **Built with Bun** for fast package management
- 🔒 **Secure transfers** - files never touch the server
- ⏰ **Room expiration** - automatic cleanup after 24 hours
- 🎨 **Web interface** with Handlebars templates
- 📊 **Progress tracking** for file transfers

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma
- **WebSocket**: Socket.IO
- **View Engine**: Handlebars (HBS)
- **Package Manager**: Bun
- **Language**: TypeScript
- **Deployment**: Vercel

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/filepizza-backend.git
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

## 🔧 Environment Variables

```env
DATABASE_URL="postgresql://username:password@localhost:5432/filepizza"
```

## 🚀 Running the Application

```bash
# Development mode
bun run start:dev

# Production mode
bun run start:prod

# Watch mode
bun run start
```

The server will start on `http://localhost:3000`

## 🌐 Usage

### Web Interface
1. **Visit** `http://localhost:3000`
2. **Send File**: Select file → "Create Room & Send File"
3. **Share Link**: Copy the generated transfer link
4. **Receive File**: Receiver opens link → file transfers directly

### API Endpoints

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

#### WebRTC Signaling
- `offer` - WebRTC offer exchange
- `answer` - WebRTC answer exchange  
- `ice-candidate` - ICE candidate exchange

## 🏗️ Architecture

1. **Client creates room** → POST `/rooms` → Returns room ID and shareable link
2. **Sender joins room** → WebSocket `join-room` with role 'sender'
3. **Receiver opens link** → Auto-joins room as 'receiver'
4. **WebRTC handshake** → Server facilitates offer/answer/ICE candidate exchange
5. **Chunked transfer** → Files transfer directly between browsers in 16KB chunks
6. **Auto cleanup** → Rooms expire after 24 hours

## 🗄️ Database Schema

```sql
model Room {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  expiresAt DateTime
  isActive  Boolean  @default(true)
}
```

## 🔧 Development

```bash
# Generate Prisma client after schema changes
bunx prisma generate

# Create new migration
bunx prisma migrate dev --name migration_name

# View database
bunx prisma studio
```

## 🧪 Testing

```bash
# Unit tests
bun run test

# E2E tests
bun run test:e2e

# Test coverage
bun run test:cov
```

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel --prod
```

3. **Environment Variables**: Set `DATABASE_URL` in Vercel dashboard

### Database Setup
- Use **Neon**, **Supabase**, or **Railway** for PostgreSQL
- Update `DATABASE_URL` in production environment

## 📁 Project Structure

```
src/
├── app.controller.ts     # Main routes (/, /transfer/:id)
├── app.module.ts         # App module configuration
├── main.ts              # Application bootstrap
├── prisma/
│   └── prisma.service.ts # Database service
├── room/
│   ├── room.controller.ts # Room API endpoints
│   ├── room.service.ts   # Room business logic
│   └── room.module.ts    # Room module
└── signaling/
    └── signaling.gateway.ts # WebSocket signaling
views/
└── index.hbs            # Handlebars template
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the original [FilePizza](https://file.pizza) project
- Built with [NestJS](https://nestjs.com/)
- WebRTC implementation using native browser APIs
