# ChatFlow API Documentation

Complete API reference for the ChatFlow real-time chat application.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

## Endpoints

### Authentication

#### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securePassword123"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": null,
    "status": "online"
  },
  "token": "jwt_token_here"
}
```

---

#### Login

**POST** `/auth/login`

Authenticate a user and get a token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "url",
    "status": "online"
  },
  "token": "jwt_token_here"
}
```

---

#### Get Current User

**GET** `/auth/me`

Get the currently authenticated user's information.

**Headers:**
```
Authorization: Bearer TOKEN
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar": "url",
  "bio": "Software Developer",
  "status": "online",
  "createdAt": "2026-02-18T12:00:00Z"
}
```

---

#### Update Profile

**PUT** `/auth/profile`

Update the current user's profile.

**Headers:**
```
Authorization: Bearer TOKEN
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "bio": "Full Stack Developer",
  "avatar": "new_avatar_url"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Jane Doe",
  "bio": "Full Stack Developer",
  "avatar": "new_avatar_url"
}
```

---

### Users

#### Get All Users

**GET** `/users`

Get a list of all users.

**Headers:**
```
Authorization: Bearer TOKEN
```

**Query Parameters:**
- `search` (optional): Search by name or email
- `status` (optional): Filter by status (online, away, busy, offline)

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "url",
    "status": "online",
    "bio": "Software Developer"
  }
]
```

---

#### Get User by ID

**GET** `/users/:id`

Get detailed information about a specific user.

**Headers:**
```
Authorization: Bearer TOKEN
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "url",
  "status": "online",
  "bio": "Software Developer",
  "lastSeen": "2026-02-18T12:00:00Z",
  "createdAt": "2026-01-01T00:00:00Z"
}
```

---

#### Update User Status

**PUT** `/users/:id/status`

Update a user's status.

**Headers:**
```
Authorization: Bearer TOKEN
```

**Request Body:**
```json
{
  "status": "away"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "status": "away",
  "lastSeen": "2026-02-18T12:00:00Z"
}
```

---

### Channels

#### Get All Channels

**GET** `/channels`

Get all channels the user is a member of.

**Headers:**
```
Authorization: Bearer TOKEN
```

**Query Parameters:**
- `type` (optional): Filter by type (public, private, direct)

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "general",
    "description": "General discussions",
    "type": "public",
    "avatar": null,
    "memberCount": 5,
    "unreadCount": 3,
    "lastMessage": {
      "id": "uuid",
      "content": "Last message",
      "timestamp": "2026-02-18T12:00:00Z"
    },
    "createdAt": "2026-01-01T00:00:00Z"
  }
]
```

---

#### Create Channel

**POST** `/channels`

Create a new channel.

**Headers:**
```
Authorization: Bearer TOKEN
```

**Request Body:**
```json
{
  "name": "development",
  "description": "Development team channel",
  "type": "public",
  "members": ["user-id-1", "user-id-2"]
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "development",
  "description": "Development team channel",
  "type": "public",
  "members": ["user-id-1", "user-id-2"],
  "createdAt": "2026-02-18T12:00:00Z"
}
```

---

#### Get Channel Details

**GET** `/channels/:id`

Get detailed information about a specific channel.

**Headers:**
```
Authorization: Bearer TOKEN
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "general",
  "description": "General discussions",
  "type": "public",
  "avatar": null,
  "createdAt": "2026-01-01T00:00:00Z",
  "members": [
    {
      "id": "uuid",
      "name": "John Doe",
      "avatar": "url",
      "role": "admin",
      "joinedAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

---

#### Update Channel

**PUT** `/channels/:id`

Update channel information.

**Headers:**
```
Authorization: Bearer TOKEN
```

**Request Body:**
```json
{
  "name": "general-chat",
  "description": "Updated description"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "general-chat",
  "description": "Updated description",
  "updatedAt": "2026-02-18T12:00:00Z"
}
```

---

#### Delete Channel

**DELETE** `/channels/:id`

Delete a channel (admin only).

**Headers:**
```
Authorization: Bearer TOKEN
```

**Response:** `204 No Content`

---

#### Add Channel Member

**POST** `/channels/:id/members`

Add a member to a channel.

**Headers:**
```
Authorization: Bearer TOKEN
```

**Request Body:**
```json
{
  "userId": "user-uuid",
  "role": "member"
}
```

**Response:** `200 OK`
```json
{
  "userId": "user-uuid",
  "channelId": "channel-uuid",
  "role": "member",
  "joinedAt": "2026-02-18T12:00:00Z"
}
```

---

#### Remove Channel Member

**DELETE** `/channels/:id/members/:userId`

Remove a member from a channel.

**Headers:**
```
Authorization: Bearer TOKEN
```

**Response:** `204 No Content`

---

### Messages

#### Get Channel Messages

**GET** `/channels/:id/messages`

Get messages for a specific channel.

**Headers:**
```
Authorization: Bearer TOKEN
```

**Query Parameters:**
- `limit` (optional, default: 50): Number of messages to return
- `before` (optional): Get messages before this message ID
- `after` (optional): Get messages after this message ID

**Response:** `200 OK`
```json
{
  "messages": [
    {
      "id": "uuid",
      "content": "Hello, world!",
      "type": "text",
      "senderId": "uuid",
      "sender": {
        "id": "uuid",
        "name": "John Doe",
        "avatar": "url"
      },
      "channelId": "uuid",
      "replyToId": null,
      "edited": false,
      "reactions": [
        {
          "emoji": "👍",
          "users": [
            {
              "id": "uuid",
              "name": "Jane Doe"
            }
          ],
          "count": 1
        }
      ],
      "attachments": [],
      "createdAt": "2026-02-18T12:00:00Z",
      "updatedAt": "2026-02-18T12:00:00Z"
    }
  ],
  "hasMore": true,
  "nextCursor": "cursor-string"
}
```

---

#### Send Message

**POST** `/channels/:id/messages`

Send a new message to a channel.

**Headers:**
```
Authorization: Bearer TOKEN
```

**Request Body:**
```json
{
  "content": "Hello, world!",
  "type": "text",
  "replyToId": "message-uuid-optional"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "content": "Hello, world!",
  "type": "text",
  "senderId": "uuid",
  "channelId": "uuid",
  "replyToId": null,
  "edited": false,
  "reactions": [],
  "attachments": [],
  "createdAt": "2026-02-18T12:00:00Z"
}
```

---

#### Edit Message

**PUT** `/messages/:id`

Edit an existing message.

**Headers:**
```
Authorization: Bearer TOKEN
```

**Request Body:**
```json
{
  "content": "Updated message content"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "content": "Updated message content",
  "edited": true,
  "updatedAt": "2026-02-18T12:05:00Z"
}
```

---

#### Delete Message

**DELETE** `/messages/:id`

Delete a message.

**Headers:**
```
Authorization: Bearer TOKEN
```

**Response:** `204 No Content`

---

#### Add Reaction

**POST** `/messages/:id/reactions`

Add a reaction to a message.

**Headers:**
```
Authorization: Bearer TOKEN
```

**Request Body:**
```json
{
  "emoji": "👍"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "emoji": "👍",
  "userId": "uuid",
  "messageId": "uuid",
  "createdAt": "2026-02-18T12:00:00Z"
}
```

---

#### Remove Reaction

**DELETE** `/messages/:id/reactions/:emoji`

Remove a reaction from a message.

**Headers:**
```
Authorization: Bearer TOKEN
```

**Response:** `204 No Content`

---

### File Upload

#### Upload File

**POST** `/upload`

Upload a file attachment.

**Headers:**
```
Authorization: Bearer TOKEN
Content-Type: multipart/form-data
```

**Request Body:** (form-data)
- `file`: File to upload

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "document.pdf",
  "url": "https://example.com/uploads/document.pdf",
  "type": "application/pdf",
  "size": 1024000,
  "createdAt": "2026-02-18T12:00:00Z"
}
```

---

## WebSocket Events

Connect to WebSocket server at `ws://localhost:3000`

### Client → Server Events

#### authenticate
```javascript
socket.emit('authenticate', { token: 'JWT_TOKEN' });
```

#### message:send
```javascript
socket.emit('message:send', {
  channelId: 'uuid',
  content: 'Hello!',
  type: 'text',
  replyToId: 'uuid-optional'
});
```

#### message:edit
```javascript
socket.emit('message:edit', {
  messageId: 'uuid',
  content: 'Updated message'
});
```

#### message:delete
```javascript
socket.emit('message:delete', {
  messageId: 'uuid'
});
```

#### typing:start
```javascript
socket.emit('typing:start', {
  channelId: 'uuid'
});
```

#### typing:stop
```javascript
socket.emit('typing:stop', {
  channelId: 'uuid'
});
```

#### reaction:add
```javascript
socket.emit('reaction:add', {
  messageId: 'uuid',
  emoji: '👍'
});
```

#### reaction:remove
```javascript
socket.emit('reaction:remove', {
  messageId: 'uuid',
  emoji: '👍'
});
```

#### status:update
```javascript
socket.emit('status:update', {
  status: 'away'
});
```

### Server → Client Events

#### message:new
```javascript
socket.on('message:new', (data) => {
  // data.message contains the new message
});
```

#### message:updated
```javascript
socket.on('message:updated', (data) => {
  // data.message contains the updated message
});
```

#### message:deleted
```javascript
socket.on('message:deleted', (data) => {
  // data.messageId, data.channelId
});
```

#### typing:user
```javascript
socket.on('typing:user', (data) => {
  // data.userId, data.channelId
});
```

#### typing:stop
```javascript
socket.on('typing:stop', (data) => {
  // data.userId, data.channelId
});
```

#### reaction:added
```javascript
socket.on('reaction:added', (data) => {
  // data.messageId, data.reaction
});
```

#### reaction:removed
```javascript
socket.on('reaction:removed', (data) => {
  // data.messageId, data.userId, data.emoji
});
```

#### user:online
```javascript
socket.on('user:online', (data) => {
  // data.userId, data.status
});
```

#### user:offline
```javascript
socket.on('user:offline', (data) => {
  // data.userId, data.lastSeen
});
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| `AUTH_REQUIRED` | Authentication required | No token provided |
| `AUTH_INVALID` | Invalid token | Token is invalid or expired |
| `USER_NOT_FOUND` | User not found | User does not exist |
| `CHANNEL_NOT_FOUND` | Channel not found | Channel does not exist |
| `MESSAGE_NOT_FOUND` | Message not found | Message does not exist |
| `FORBIDDEN` | Forbidden | No permission to perform action |
| `VALIDATION_ERROR` | Validation error | Invalid input data |
| `SERVER_ERROR` | Internal server error | Unexpected server error |

---

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **Authentication**: 5 requests per minute
- **Messages**: 50 requests per minute
- **Other endpoints**: 100 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1645189200
```

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `limit`: Number of items per page (default: 50, max: 100)
- `cursor`: Cursor for next page

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "hasMore": true,
    "nextCursor": "cursor-string",
    "total": 250
  }
}
```

---

## Webhooks (Optional)

Configure webhooks to receive events:

**POST** `/webhooks`

```json
{
  "url": "https://your-server.com/webhook",
  "events": ["message.created", "channel.created"],
  "secret": "webhook-secret"
}
```

Webhook payload:
```json
{
  "event": "message.created",
  "data": { ... },
  "timestamp": "2026-02-18T12:00:00Z"
}
```

---

For more information, see the [Backend Guide](BACKEND_GUIDE.md).
