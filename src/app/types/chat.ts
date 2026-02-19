export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen?: Date;
  bio?: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  edited?: boolean;
  editedAt?: Date;
  reactions?: Reaction[];
  attachments?: Attachment[];
  replyTo?: string;
  type: 'text' | 'image' | 'file' | 'system';
}

export interface Reaction {
  emoji: string;
  userId: string;
  userName: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'direct';
  members: string[];
  createdAt: Date;
  lastMessage?: Message;
  unreadCount?: number;
  avatar?: string;
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  channelId: string;
}
