# Backend Implementation Guide

This document provides a complete guide for implementing a Node.js backend for the ChatFlow application.

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Project Setup](#project-setup)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [WebSocket Events](#websocket-events)
6. [Complete Code Examples](#complete-code-examples)

## Tech Stack

### Recommended Backend Technologies
- **Node.js** (v18+)
- **Express.js** - Web framework
- **Socket.IO** - Real-time WebSocket communication
- **PostgreSQL** or **MongoDB** - Database
- **Prisma** or **Mongoose** - ORM/ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **multer** - File uploads

## Project Setup

### 1. Initialize Node.js Project

```bash
mkdir chatflow-backend
cd chatflow-backend
npm init -y
```

### 2. Install Dependencies

```bash
npm install express socket.io cors dotenv
npm install jsonwebtoken bcrypt
npm install multer
npm install prisma @prisma/client  # For PostgreSQL
# OR
npm install mongoose  # For MongoDB

npm install --save-dev typescript @types/node @types/express
npm install --save-dev ts-node nodemon
npm install --save-dev @types/cors @types/bcrypt @types/jsonwebtoken
```

### 3. Project Structure

```
chatflow-backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── socket.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── channelController.ts
│   │   └── messageController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Channel.ts
│   │   └── Message.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── channelRoutes.ts
│   │   └── messageRoutes.ts
│   ├── socket/
│   │   └── chatHandler.ts
│   ├── utils/
│   │   └── validation.ts
│   ├── types/
│   │   └── index.ts
│   └── server.ts
├── uploads/
├── .env
├── .gitignore
├── package.json
└── tsconfig.json
```

## Database Schema

### PostgreSQL with Prisma

**prisma/schema.prisma**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String
  password      String
  avatar        String?
  bio           String?
  status        Status    @default(ONLINE)
  lastSeen      DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  sentMessages  Message[] @relation("MessageSender")
  reactions     Reaction[]
  channels      ChannelMember[]
  typing        TypingIndicator[]
}

enum Status {
  ONLINE
  AWAY
  BUSY
  OFFLINE
}

model Channel {
  id          String          @id @default(uuid())
  name        String
  description String?
  type        ChannelType
  avatar      String?
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  
  members     ChannelMember[]
  messages    Message[]
}

enum ChannelType {
  PUBLIC
  PRIVATE
  DIRECT
}

model ChannelMember {
  id        String   @id @default(uuid())
  userId    String
  channelId String
  role      MemberRole @default(MEMBER)
  joinedAt  DateTime @default(now())
  lastRead  DateTime?
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  channel   Channel  @relation(fields: [channelId], references: [id], onDelete: Cascade)
  
  @@unique([userId, channelId])
}

enum MemberRole {
  ADMIN
  MEMBER
}

model Message {
  id          String      @id @default(uuid())
  content     String
  type        MessageType @default(TEXT)
  senderId    String
  channelId   String
  replyToId   String?
  edited      Boolean     @default(false)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  sender      User        @relation("MessageSender", fields: [senderId], references: [id], onDelete: Cascade)
  channel     Channel     @relation(fields: [channelId], references: [id], onDelete: Cascade)
  replyTo     Message?    @relation("MessageReply", fields: [replyToId], references: [id])
  replies     Message[]   @relation("MessageReply")
  reactions   Reaction[]
  attachments Attachment[]
}

enum MessageType {
  TEXT
  IMAGE
  FILE
  SYSTEM
}

model Reaction {
  id        String   @id @default(uuid())
  emoji     String
  userId    String
  messageId String
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  message   Message  @relation(fields: [messageId], references: [id], onDelete: Cascade)
  
  @@unique([userId, messageId, emoji])
}

model Attachment {
  id        String   @id @default(uuid())
  name      String
  url       String
  type      String
  size      Int
  messageId String
  createdAt DateTime @default(now())
  
  message   Message  @relation(fields: [messageId], references: [id], onDelete: Cascade)
}

model TypingIndicator {
  id        String   @id @default(uuid())
  userId    String
  channelId String
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## API Endpoints

### Authentication

```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
POST   /api/auth/logout          - Logout user
GET    /api/auth/me              - Get current user
PUT    /api/auth/profile         - Update user profile
```

### Users

```
GET    /api/users                - Get all users
GET    /api/users/:id            - Get user by ID
PUT    /api/users/:id/status     - Update user status
```

### Channels

```
GET    /api/channels             - Get all channels for user
POST   /api/channels             - Create new channel
GET    /api/channels/:id         - Get channel details
PUT    /api/channels/:id         - Update channel
DELETE /api/channels/:id         - Delete channel
POST   /api/channels/:id/members - Add member to channel
DELETE /api/channels/:id/members/:userId - Remove member
```

### Messages

```
GET    /api/channels/:id/messages - Get messages for channel
POST   /api/channels/:id/messages - Send message
PUT    /api/messages/:id          - Edit message
DELETE /api/messages/:id          - Delete message
POST   /api/messages/:id/reactions - Add reaction
DELETE /api/messages/:id/reactions/:emoji - Remove reaction
```

## WebSocket Events

### Client -> Server

```javascript
// Connection
'authenticate' - { token: string }

// Messaging
'message:send' - { channelId, content, replyToId? }
'message:edit' - { messageId, content }
'message:delete' - { messageId }

// Typing
'typing:start' - { channelId }
'typing:stop' - { channelId }

// Reactions
'reaction:add' - { messageId, emoji }
'reaction:remove' - { messageId, emoji }

// Presence
'status:update' - { status: 'online' | 'away' | 'busy' | 'offline' }

// Channels
'channel:join' - { channelId }
'channel:leave' - { channelId }
```

### Server -> Client

```javascript
// Messages
'message:new' - { message, channel }
'message:updated' - { message }
'message:deleted' - { messageId, channelId }

// Typing
'typing:user' - { userId, userName, channelId }
'typing:stop' - { userId, channelId }

// Reactions
'reaction:added' - { messageId, reaction }
'reaction:removed' - { messageId, userId, emoji }

// Presence
'user:online' - { userId, status }
'user:offline' - { userId, lastSeen }

// Channels
'channel:updated' - { channel }
```

## Complete Code Examples

### 1. server.ts

```typescript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import channelRoutes from './routes/channelRoutes';
import messageRoutes from './routes/messageRoutes';
import { setupSocketHandlers } from './socket/chatHandler';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);

// Error handling
app.use(errorHandler);

// Socket.IO
setupSocketHandlers(io);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### 2. socket/chatHandler.ts

```typescript
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthSocket extends Socket {
  userId?: string;
}

export const setupSocketHandlers = (io: Server) => {
  // Authentication middleware
  io.use(async (socket: AuthSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      socket.userId = decoded.userId;

      // Update user status to online
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { status: 'ONLINE', lastSeen: new Date() },
      });

      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket: AuthSocket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user's channels
    const userChannels = await prisma.channelMember.findMany({
      where: { userId: socket.userId },
      include: { channel: true },
    });

    userChannels.forEach(({ channel }) => {
      socket.join(`channel:${channel.id}`);
    });

    // Broadcast user online status
    io.emit('user:online', { userId: socket.userId, status: 'ONLINE' });

    // Message handlers
    socket.on('message:send', async (data) => {
      try {
        const message = await prisma.message.create({
          data: {
            content: data.content,
            senderId: socket.userId!,
            channelId: data.channelId,
            replyToId: data.replyToId,
            type: data.type || 'TEXT',
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            reactions: true,
            attachments: true,
          },
        });

        io.to(`channel:${data.channelId}`).emit('message:new', { message });
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('message:edit', async (data) => {
      try {
        const message = await prisma.message.update({
          where: {
            id: data.messageId,
            senderId: socket.userId,
          },
          data: {
            content: data.content,
            edited: true,
          },
          include: {
            sender: true,
            reactions: true,
          },
        });

        io.to(`channel:${message.channelId}`).emit('message:updated', { message });
      } catch (error) {
        socket.emit('error', { message: 'Failed to edit message' });
      }
    });

    socket.on('message:delete', async (data) => {
      try {
        const message = await prisma.message.findUnique({
          where: { id: data.messageId },
        });

        if (message?.senderId === socket.userId) {
          await prisma.message.delete({
            where: { id: data.messageId },
          });

          io.to(`channel:${message.channelId}`).emit('message:deleted', {
            messageId: data.messageId,
            channelId: message.channelId,
          });
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to delete message' });
      }
    });

    // Typing indicators
    socket.on('typing:start', (data) => {
      socket.to(`channel:${data.channelId}`).emit('typing:user', {
        userId: socket.userId,
        channelId: data.channelId,
      });
    });

    socket.on('typing:stop', (data) => {
      socket.to(`channel:${data.channelId}`).emit('typing:stop', {
        userId: socket.userId,
        channelId: data.channelId,
      });
    });

    // Reactions
    socket.on('reaction:add', async (data) => {
      try {
        const reaction = await prisma.reaction.create({
          data: {
            emoji: data.emoji,
            userId: socket.userId!,
            messageId: data.messageId,
          },
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        });

        const message = await prisma.message.findUnique({
          where: { id: data.messageId },
        });

        io.to(`channel:${message?.channelId}`).emit('reaction:added', {
          messageId: data.messageId,
          reaction,
        });
      } catch (error) {
        // Reaction already exists or error
      }
    });

    socket.on('reaction:remove', async (data) => {
      try {
        await prisma.reaction.delete({
          where: {
            userId_messageId_emoji: {
              userId: socket.userId!,
              messageId: data.messageId,
              emoji: data.emoji,
            },
          },
        });

        const message = await prisma.message.findUnique({
          where: { id: data.messageId },
        });

        io.to(`channel:${message?.channelId}`).emit('reaction:removed', {
          messageId: data.messageId,
          userId: socket.userId,
          emoji: data.emoji,
        });
      } catch (error) {
        // Error removing reaction
      }
    });

    // Status updates
    socket.on('status:update', async (data) => {
      try {
        await prisma.user.update({
          where: { id: socket.userId },
          data: { status: data.status },
        });

        io.emit('user:status', {
          userId: socket.userId,
          status: data.status,
        });
      } catch (error) {
        // Error updating status
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.userId}`);

      await prisma.user.update({
        where: { id: socket.userId },
        data: {
          status: 'OFFLINE',
          lastSeen: new Date(),
        },
      });

      io.emit('user:offline', {
        userId: socket.userId,
        lastSeen: new Date(),
      });
    });
  });
};
```

### 3. controllers/authController.ts

```typescript
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        status: true,
      },
    });

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    // Update user status
    await prisma.user.update({
      where: { id: user.id },
      data: { status: 'ONLINE' },
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        status: 'ONLINE',
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};
```

### 4. middleware/auth.ts

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

### 5. .env.example

```env
# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/chatflow"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_DIR=./uploads
```

## Getting Started

1. **Initialize the database**:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

2. **Create .env file** with your configuration

3. **Start the development server**:
```bash
npm run dev
```

4. **Update frontend to connect to backend**:

In your React app, replace the ChatContext with real API calls:

```typescript
// Example: Connecting Socket.IO in React
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: yourAuthToken,
  },
});

// Listen for messages
socket.on('message:new', (data) => {
  // Update your state
});

// Send message
socket.emit('message:send', {
  channelId: 'channel-id',
  content: 'Hello!',
});
```

## Security Best Practices

1. **Environment Variables**: Never commit .env files
2. **Password Hashing**: Always use bcrypt with proper salt rounds
3. **JWT Tokens**: Use strong secrets and reasonable expiration times
4. **Input Validation**: Validate all user inputs
5. **Rate Limiting**: Implement rate limiting for API endpoints
6. **CORS**: Configure CORS properly for production
7. **SQL Injection**: Use Prisma's query builders (never raw SQL with user input)
8. **File Uploads**: Validate file types and sizes
9. **HTTPS**: Always use HTTPS in production
10. **Error Handling**: Don't expose sensitive information in error messages

## Production Deployment

### Using Docker

**Dockerfile**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

**docker-compose.yml**:
```yaml
version: '3.8'
services:
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: chatflow
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/chatflow
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - db

volumes:
  postgres_data:
```

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [JWT Best Practices](https://jwt.io/introduction)

---

For questions or issues, please refer to the main README.md or open an issue on GitHub.
