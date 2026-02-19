import React from 'react';
import { Hash, Lock, Users } from 'lucide-react';
import { Channel } from '../types/chat';
import { useChat } from '../context/ChatContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';

interface ChannelItemProps {
  channel: Channel;
}

export const ChannelItem: React.FC<ChannelItemProps> = ({ channel }) => {
  const { activeChannel, setActiveChannel, users } = useChat();
  const isActive = activeChannel?.id === channel.id;

  const getChannelIcon = () => {
    if (channel.type === 'direct') {
      const otherUserId = channel.members.find(id => id !== 'user-1');
      const otherUser = users.find(u => u.id === otherUserId);
      return (
        <Avatar className="h-8 w-8">
          <AvatarImage src={channel.avatar || otherUser?.avatar} />
          <AvatarFallback>{channel.name[0]}</AvatarFallback>
        </Avatar>
      );
    }
    
    if (channel.type === 'private') {
      return <Lock className="h-4 w-4 text-muted-foreground" />;
    }
    
    return <Hash className="h-4 w-4 text-muted-foreground" />;
  };

  const getStatusIndicator = () => {
    if (channel.type === 'direct') {
      const otherUserId = channel.members.find(id => id !== 'user-1');
      const otherUser = users.find(u => u.id === otherUserId);
      
      if (otherUser) {
        const statusColors = {
          online: 'bg-green-500',
          away: 'bg-yellow-500',
          busy: 'bg-red-500',
          offline: 'bg-gray-400',
        };
        
        return (
          <span className={cn(
            'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background',
            statusColors[otherUser.status]
          )} />
        );
      }
    }
    return null;
  };

  return (
    <button
      onClick={() => setActiveChannel(channel)}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-accent',
        isActive && 'bg-accent'
      )}
    >
      <div className="relative">
        {getChannelIcon()}
        {getStatusIndicator()}
      </div>
      
      <div className="flex-1 text-left overflow-hidden">
        <div className="flex items-center justify-between">
          <span className={cn(
            'truncate',
            isActive ? 'font-semibold' : 'font-medium',
            channel.unreadCount && channel.unreadCount > 0 && 'font-semibold'
          )}>
            {channel.type === 'direct' ? channel.name : `# ${channel.name}`}
          </span>
          {channel.unreadCount && channel.unreadCount > 0 && (
            <Badge variant="default" className="ml-2 h-5 min-w-5 px-1.5">
              {channel.unreadCount}
            </Badge>
          )}
        </div>
        {channel.description && (
          <p className="text-xs text-muted-foreground truncate">
            {channel.description}
          </p>
        )}
      </div>
    </button>
  );
};
