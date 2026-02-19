import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Message, Channel, TypingIndicator } from '../types/chat';
import { mockUsers, mockChannels, mockMessages } from '../data/mockData';
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:5000");

interface ChatContextType {
  currentUser: User;
  updateAvatar: (avatar: string) => void;
  users: User[];
  channels: Channel[];
  messages: Record<string, Message[]>;
  activeChannel: Channel | null;
  typingUsers: TypingIndicator[];
  setActiveChannel: (channel: Channel) => void;
  sendMessage: (content: string, replyToId?: string) => void;
  addReaction: (messageId: string, emoji: string) => void;
  removeReaction: (messageId: string, emoji: string) => void;
  editMessage: (messageId: string, newContent: string) => void;
  deleteMessage: (messageId: string) => void;
  setTyping: (isTyping: boolean) => void;
  searchMessages: (query: string) => Message[];
  markChannelAsRead: (channelId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // ✅ FIXED: Properly store currentUser with localStorage
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : mockUsers[0];
  });

  const [users] = useState<User[]>(mockUsers);
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [activeChannel, setActiveChannelState] = useState<Channel | null>(mockChannels[0]);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);

  // ✅ NEW: Update Avatar (PROPER PLACE)
  const updateAvatar = (avatar: string) => {
    const updatedUser = { ...currentUser, avatar };
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  // ✅ JOIN ROOM
  useEffect(() => {
    if (activeChannel) {
      socket.emit("join_room", activeChannel.id);
    }
  }, [activeChannel]);

  // ✅ RECEIVE MESSAGE
  useEffect(() => {
    socket.on("receive_message", (newMessage: Message & { channelId: string }) => {
      setMessages(prev => ({
        ...prev,
        [newMessage.channelId]: [
          ...(prev[newMessage.channelId] || []),
          newMessage,
        ],
      }));

      setChannels(prev =>
        prev.map(ch =>
          ch.id === newMessage.channelId
            ? { ...ch, lastMessage: newMessage }
            : ch
        )
      );
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const setActiveChannel = (channel: Channel) => {
    setActiveChannelState(channel);
    markChannelAsRead(channel.id);
  };

  const sendMessage = (content: string, replyToId?: string) => {
    if (!activeChannel || !content.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      senderId: currentUser.id,
      content: content.trim(),
      timestamp: new Date(),
      type: 'text',
      replyTo: replyToId,
      reactions: [],
    };

    socket.emit("send_message", {
      ...newMessage,
      channelId: activeChannel.id,
    });

    setMessages(prev => ({
      ...prev,
      [activeChannel.id]: [
        ...(prev[activeChannel.id] || []),
        newMessage,
      ],
    }));

    setChannels(prev =>
      prev.map(ch =>
        ch.id === activeChannel.id
          ? { ...ch, lastMessage: newMessage }
          : ch
      )
    );
  };

  const addReaction = (messageId: string, emoji: string) => {
    if (!activeChannel) return;

    setMessages(prev => ({
      ...prev,
      [activeChannel.id]: prev[activeChannel.id].map(msg =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: [
                ...(msg.reactions || []),
                { emoji, userId: currentUser.id, userName: currentUser.name }
              ],
            }
          : msg
      ),
    }));
  };

  const removeReaction = (messageId: string, emoji: string) => {
    if (!activeChannel) return;

    setMessages(prev => ({
      ...prev,
      [activeChannel.id]: prev[activeChannel.id].map(msg =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: msg.reactions?.filter(
                r => !(r.userId === currentUser.id && r.emoji === emoji)
              ),
            }
          : msg
      ),
    }));
  };

  const editMessage = (messageId: string, newContent: string) => {
    if (!activeChannel) return;

    setMessages(prev => ({
      ...prev,
      [activeChannel.id]: prev[activeChannel.id].map(msg =>
        msg.id === messageId && msg.senderId === currentUser.id
          ? { ...msg, content: newContent, edited: true, editedAt: new Date() }
          : msg
      ),
    }));
  };

  const deleteMessage = (messageId: string) => {
    if (!activeChannel) return;

    setMessages(prev => ({
      ...prev,
      [activeChannel.id]: prev[activeChannel.id].filter(msg => msg.id !== messageId),
    }));
  };

  const setTyping = () => {};

  const searchMessages = (query: string): Message[] => {
    if (!query.trim()) return [];
    return Object.values(messages)
      .flat()
      .filter(msg =>
        msg.content.toLowerCase().includes(query.toLowerCase())
      );
  };

  const markChannelAsRead = (channelId: string) => {
    setChannels(prev =>
      prev.map(ch =>
        ch.id === channelId ? { ...ch, unreadCount: 0 } : ch
      )
    );
  };

  return (
    <ChatContext.Provider
      value={{
        currentUser,
        updateAvatar,
        users,
        channels,
        messages,
        activeChannel,
        typingUsers,
        setActiveChannel,
        sendMessage,
        addReaction,
        removeReaction,
        editMessage,
        deleteMessage,
        setTyping,
        searchMessages,
        markChannelAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
