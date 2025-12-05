"use client";

import { ArrowUpRight, Check, X } from "lucide-react";
import { motion, type Transition } from "motion/react";
import { useState } from "react";
import type { Notification } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";
import { markAllAsRead, markAsRead } from "@/actions/notifications";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/animate-ui/components/radix/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const transition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 26,
};

const getCardVariants = (i: number) => ({
  collapsed: {
    marginTop: i === 0 ? 0 : -44,
    scaleX: 1 - i * 0.05,
  },
  expanded: {
    marginTop: i === 0 ? 0 : 4,
    scaleX: 1,
  },
});

const textSwitchTransition: Transition = {
  duration: 0.22,
  ease: "easeInOut",
};

const notificationTextVariants = {
  collapsed: { opacity: 1, y: 0, pointerEvents: "auto" as const },
  expanded: { opacity: 0, y: -16, pointerEvents: "none" as const },
};

const viewAllTextVariants = {
  collapsed: { opacity: 0, y: 16, pointerEvents: "none" as const },
  expanded: { opacity: 1, y: 0, pointerEvents: "auto" as const },
};

interface NotificationListProps {
  notifications?: Notification[];
}

function NotificationList({ notifications = [] }: NotificationListProps) {
  const [hovered, setHovered] = useState(false);

  const handleDismiss = async (id: string) => {
    await markAsRead(id);
  };

  const handleClearAll = async () => {
    await markAllAsRead();
  };

  const displayedNotifications = notifications.slice(0, 3);

  return (
    <motion.div
      className="w-auto space-y-2"
      initial="collapsed"
      whileHover="expanded"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <div className={`transition-all duration-200 ${hovered && "space-y-2"}`}>
        {displayedNotifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No new notifications
          </div>
        ) : (
          displayedNotifications.map((notification, i) => (
            <motion.div
              key={notification.id}
              className="bg-secondary rounded-md px-4 py-2 shadow-sm hover:shadow-lg transition-shadow duration-200 relative group"
              variants={getCardVariants(i)}
              transition={transition}
              style={{
                zIndex: displayedNotifications.length - i,
              }}
            >
              <div className="flex justify-between items-center">
                <h1 className="text-sm font-medium">{notification.title}</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDismiss(notification.id);
                  }}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Dismiss</span>
                </Button>
              </div>
              <div className="text-xs text-muted-foreground font-medium mt-1">
                <span>
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </span>
                &nbsp;•&nbsp;
                <span className="line-clamp-1">{notification.message}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <div className="size-5 rounded-full bg-accent text-foreground text-xs flex items-center justify-center font-medium">
          {notifications.length}
        </div>
        <span className="grid">
          <motion.span
            className="text-sm font-medium text-muted-foreground row-start-1 col-start-1"
            variants={notificationTextVariants}
            transition={textSwitchTransition}
          >
            Notifications
          </motion.span>
          <Dialog>
            <DialogTrigger asChild>
              <motion.span
                className="text-sm font-medium text-muted-foreground flex items-center gap-1 cursor-pointer select-none row-start-1 col-start-1 hover:text-foreground"
                variants={viewAllTextVariants}
                transition={textSwitchTransition}
              >
                View all <ArrowUpRight className="size-4" />
              </motion.span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Notifications</DialogTitle>
              </DialogHeader>
              <div className="flex justify-end mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={notifications.length === 0}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark all as read
                </Button>
              </div>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {notifications.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    No new notifications
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex flex-col gap-1 border-b pb-3 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold">
                            {notification.title}
                          </h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDismiss(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                            },
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </span>
      </div>
    </motion.div>
  );
}

export { NotificationList };
