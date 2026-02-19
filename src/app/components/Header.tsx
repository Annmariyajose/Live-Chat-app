import React, { useState, useRef } from "react";
import { Search, Settings, Bell, HelpCircle, LogOut } from "lucide-react";
import { useChat } from "../context/ChatContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";

export const Header: React.FC = () => {
  const { currentUser, updateAvatar } = useChat();

  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // 🔔 Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New message received", read: false },
    { id: 2, text: "Someone mentioned you", read: false },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  // 👤 Profile Image Upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      updateAvatar(base64);
    };
    reader.readAsDataURL(file);
  };

  const statusColors: Record<string, string> = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    busy: "bg-red-500",
    offline: "bg-gray-400",
  };

  return (
    <>
      <div className="h-14 border-b flex items-center justify-between px-4 bg-background">
        {/* 🔍 Search */}
        <div className="flex items-center gap-2 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {showSearch && (
            <Input
              placeholder="Search messages..."
              className="max-w-md"
              autoFocus
              onBlur={() =>
                setTimeout(() => setShowSearch(false), 200)
              }
            />
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 relative">
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* 🔔 Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowNotifications((prev) => !prev);
                markAllAsRead();
              }}
            >
              <Bell className="h-5 w-5" />
            </Button>

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {unreadCount}
              </span>
            )}

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-3 z-50">
                <h4 className="font-semibold mb-2">Notifications</h4>

                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No notifications
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="text-sm py-1 border-b last:border-none"
                    >
                      {n.text}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 👤 Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>
                    {currentUser.name[0]}
                  </AvatarFallback>
                </Avatar>

                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                    statusColors[currentUser.status] ||
                    "bg-gray-400"
                  }`}
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-3 p-2">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>
                    {currentUser.name[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 overflow-hidden">
                  <p className="font-semibold truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setShowProfile(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 👤 Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="relative cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Avatar className="h-20 w-20">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>
                    {currentUser.name[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />

              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {currentUser.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentUser.email}
                </p>

                <div className="mt-2">
                  <Badge variant="outline" className="gap-1">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        statusColors[currentUser.status] ||
                        "bg-gray-400"
                      }`}
                    />
                    {currentUser.status}
                  </Badge>
                </div>
              </div>
            </div>

            {currentUser.bio && (
              <div>
                <label className="text-sm font-medium">
                  Bio
                </label>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentUser.bio}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
