import React from 'react';
import { X } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { cn } from './ui/utils';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose }) => {
  const { activeChannel, users } = useChat();

  if (!activeChannel || !isOpen) return null;

  const channelMembers = users.filter(u => activeChannel.members.includes(u.id));

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    offline: 'bg-gray-400',
  };

  return (
    <div className="w-80 border-l bg-background flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Details</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Channel Info */}
          <div>
            <h4 className="font-medium mb-2">About</h4>
            <p className="text-sm text-muted-foreground">
              {activeChannel.description || 'No description available'}
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              Created on {new Date(activeChannel.createdAt).toLocaleDateString()}
            </div>
          </div>

          <Separator />

          {/* Members List */}
          <div>
            <h4 className="font-medium mb-3">
              Members ({channelMembers.length})
            </h4>
            <div className="space-y-2">
              {channelMembers.map(member => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className={cn(
                      'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background',
                      statusColors[member.status]
                    )} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium truncate">{member.name}</p>
                    {member.bio && (
                      <p className="text-xs text-muted-foreground truncate">{member.bio}</p>
                    )}
                    {member.status === 'offline' && member.lastSeen && (
                      <p className="text-xs text-muted-foreground">
                        Last seen {new Date(member.lastSeen).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Shared Files */}
          <div>
            <h4 className="font-medium mb-2">Shared Files</h4>
            <p className="text-sm text-muted-foreground">No files shared yet</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
