import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { ChatProvider } from './context/ChatContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { MessageInput } from './components/MessageInput';
import { RightSidebar } from './components/RightSidebar';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  return (
    <ChatProvider>
      <div className="h-screen flex flex-col bg-background">
        <Header />
        
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex">
              <div className="flex-1 flex flex-col">
                <ChatArea />
                <MessageInput />
              </div>
              
              {/* Toggle Button for Right Sidebar */}
              {!showRightSidebar && (
                <div className="border-l p-2 flex items-start">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowRightSidebar(true)}
                  >
                    <Users className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <RightSidebar 
            isOpen={showRightSidebar} 
            onClose={() => setShowRightSidebar(false)} 
          />
        </div>
      </div>
      
      <Toaster />
    </ChatProvider>
  );
}
