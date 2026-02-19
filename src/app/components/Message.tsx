import React, { useState } from 'react';
import { MoreVertical, Smile, Reply, Edit, Trash, Copy } from 'lucide-react';
import { Message as MessageType } from '../types/chat';
import { useChat } from '../context/ChatContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { cn } from './ui/utils';
import { format } from 'date-fns';

interface MessageProps {
  message: MessageType;
  onReply?: (messageId: string) => void;
}

const EMOJI_QUICK_REACTIONS = ['👍', '❤️', '😂', '🎉', '🚀', '👀'];

export const Message: React.FC<MessageProps> = ({ message, onReply }) => {
  const { currentUser, users, addReaction, removeReaction, editMessage, deleteMessage } = useChat();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isHovered, setIsHovered] = useState(false);

  const sender = users.find(u => u.id === message.senderId);
  const isOwnMessage = message.senderId === currentUser.id;

  const handleReactionClick = (emoji: string) => {
    const existingReaction = message.reactions?.find(
      r => r.userId === currentUser.id && r.emoji === emoji
    );

    if (existingReaction) {
      removeReaction(message.id, emoji);
    } else {
      addReaction(message.id, emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      editMessage(message.id, editContent);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const groupedReactions = message.reactions?.reduce((acc, reaction) => {
    const key = reaction.emoji;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(reaction);
    return acc;
  }, {} as Record<string, typeof message.reactions>);

  return (
    <div
      className={cn(
        'group px-4 py-2 hover:bg-accent/50 transition-colors',
        isHovered && 'bg-accent/50'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 mt-0.5">
          <AvatarImage src={sender?.avatar} />
          <AvatarFallback>{sender?.name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold">{sender?.name}</span>
            <span className="text-xs text-muted-foreground">
              {format(message.timestamp, 'h:mm a')}
            </span>
            {message.edited && (
              <span className="text-xs text-muted-foreground italic">(edited)</span>
            )}
          </div>

          {isEditing ? (
            <div className="mt-1">
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                className="w-full px-3 py-2 border rounded-lg"
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={handleEdit}>Save</Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-0.5 break-words whitespace-pre-wrap">{message.content}</p>

              {/* Reactions */}
              {groupedReactions && Object.keys(groupedReactions).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {Object.entries(groupedReactions).map(([emoji, reactions]) => {
                    const hasReacted = reactions.some(r => r.userId === currentUser.id);
                    return (
                      <button
                        key={emoji}
                        onClick={() => handleReactionClick(emoji)}
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm border transition-colors',
                          hasReacted
                            ? 'bg-primary/10 border-primary/30'
                            : 'bg-muted hover:bg-muted/80 border-border'
                        )}
                      >
                        <span>{emoji}</span>
                        <span className="text-xs">{reactions.length}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Message Actions */}
        {!isEditing && (
          <div className={cn(
            'flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
            isHovered && 'opacity-100'
          )}>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="h-4 w-4" />
              </Button>

              {showEmojiPicker && (
                <div className="absolute top-full right-0 mt-1 p-2 bg-popover border rounded-lg shadow-lg z-50 flex gap-1">
                  {EMOJI_QUICK_REACTIONS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleReactionClick(emoji)}
                      className="hover:bg-accent rounded p-1 text-lg"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onReply?.(message.id)}
            >
              <Reply className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(message.content)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy text
                </DropdownMenuItem>
                {isOwnMessage && (
                  <>
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit message
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteMessage(message.id)}
                      className="text-destructive"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete message
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
};
