import React, { useRef, useEffect } from 'react';
import { Hash, Lock, Users } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { Message } from './Message';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export const ChatArea: React.FC = () => {
  const { activeChannel, messages, typingUsers, users } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  const channelMessages = activeChannel ? messages[activeChannel.id] || [] : [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [channelMessages, typingUsers]);

  if (!activeChannel) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p>Select a channel to start messaging</p>
      </div>
    );
  }

  const getChannelIcon = () => {
    if (activeChannel.type === 'direct') {
      const otherUserId = activeChannel.members.find(id => id !== 'user-1');
      const otherUser = users.find(u => u.id === otherUserId);
      return (
        <Avatar className="h-8 w-8">
          <AvatarImage src={activeChannel.avatar || otherUser?.avatar} />
          <AvatarFallback>{activeChannel.name[0]}</AvatarFallback>
        </Avatar>
      );
    }
    
    if (activeChannel.type === 'private') {
      return (
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          <Lock className="h-4 w-4" />
        </div>
      );
    }
    
    return (
      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
        <Hash className="h-4 w-4" />
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Channel Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          {getChannelIcon()}
          <div>
            <h2 className="font-semibold">
              {activeChannel.type === 'direct' ? activeChannel.name : `# ${activeChannel.name}`}
            </h2>
            {activeChannel.description && (
              <p className="text-sm text-muted-foreground">{activeChannel.description}</p>
            )}
            {activeChannel.type !== 'direct' && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <Users className="h-3 w-3" />
                <span>{activeChannel.members.length} members</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="py-4">
          {channelMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="mb-4">
                {getChannelIcon()}
              </div>
              <h3 className="font-semibold mb-2">
                Welcome to {activeChannel.type === 'direct' ? activeChannel.name : `#${activeChannel.name}`}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {activeChannel.type === 'direct'
                  ? `This is the beginning of your direct message history with ${activeChannel.name}.`
                  : activeChannel.description || 'This is the start of the conversation in this channel.'}
              </p>
            </div>
          ) : (
            <>
              {channelMessages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
            </>
          )}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && typingUsers[0].channelId === activeChannel.id && (
            <div className="px-4 py-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>{typingUsers[0].userName} is typing...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
