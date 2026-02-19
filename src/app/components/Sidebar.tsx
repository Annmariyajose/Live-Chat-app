import React, { useState } from 'react';
import { Plus, Hash, MessageSquare, ChevronDown } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { ChannelItem } from './ChannelItem';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

export const Sidebar: React.FC = () => {
  const { channels } = useChat();
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [directMessagesOpen, setDirectMessagesOpen] = useState(true);

  const publicChannels = channels.filter(ch => ch.type === 'public');
  const directMessages = channels.filter(ch => ch.type === 'direct');

  return (
    <div className="w-64 border-r bg-muted/30 flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">ChatFlow</h2>
        <p className="text-xs text-muted-foreground">Your workspace</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {/* Channels Section */}
          <Collapsible open={channelsOpen} onOpenChange={setChannelsOpen}>
            <CollapsibleTrigger className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-accent rounded-lg">
              <div className="flex items-center gap-2">
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform",
                  !channelsOpen && "-rotate-90"
                )} />
                <Hash className="h-4 w-4" />
                <span className="font-medium">Channels</span>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-3 w-3" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-0.5 mt-1">
              {publicChannels.map(channel => (
                <ChannelItem key={channel.id} channel={channel} />
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Direct Messages Section */}
          <Collapsible open={directMessagesOpen} onOpenChange={setDirectMessagesOpen}>
            <CollapsibleTrigger className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-accent rounded-lg">
              <div className="flex items-center gap-2">
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform",
                  !directMessagesOpen && "-rotate-90"
                )} />
                <MessageSquare className="h-4 w-4" />
                <span className="font-medium">Direct Messages</span>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-3 w-3" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-0.5 mt-1">
              {directMessages.map(channel => (
                <ChannelItem key={channel.id} channel={channel} />
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
