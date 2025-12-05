"use client";

import { ArrowUpRight, RotateCcw } from "lucide-react";
import { motion, type Transition } from "motion/react";
import { useState } from "react";
import type { Notification } from "@/types/notification";

const notifications: Notification[] = [
  {
    id: 1,
    title: "NPM Install Complete",
    description: "1,227 packages added!",
    time: "just now",
    count: 2,
  },
  {
    id: 2,
    title: "Build Succeeded",
    description: "Build finished in 12.34s",
    time: "1m 11s",
  },
  {
    id: 3,
    title: "Lint Passed",
    description: "No problems found",
    time: "5m",
  },
];

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
  collapsed: { opacity: 1, y: 0, pointerEvents: "auto" },
  expanded: { opacity: 0, y: -16, pointerEvents: "none" },
};

const viewAllTextVariants = {
  collapsed: { opacity: 0, y: 16, pointerEvents: "none" },
  expanded: { opacity: 1, y: 0, pointerEvents: "auto" },
};

function NotificationList() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="w-auto space-y-2"
      initial="collapsed"
      whileHover="expanded"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <div className={`transition-all duration-200 ${hovered && "space-y-2"}`}>
        {notifications.map((notification, i) => (
          <motion.div
            key={notification.id}
            className="bg-secondary rounded-md px-4 py-2 shadow-sm hover:shadow-lg transition-shadow duration-200 relative"
            variants={getCardVariants(i)}
            transition={transition}
            style={{
              zIndex: notifications.length - i,
            }}
          >
            <div className="flex justify-between items-center">
              <h1 className="text-sm font-medium">{notification.title}</h1>
              {notification.count && (
                <div className="flex items-center text-xs gap-0.5 font-medium text-muted-foreground">
                  <RotateCcw className="size-3" />
                  <span>{notification.count}</span>
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              <span>{notification.time}</span>
              &nbsp;•&nbsp;
              <span>{notification.description}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-2">
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
          <motion.span
            className="text-sm font-medium text-muted-foreground flex items-center gap-1 cursor-pointer select-none row-start-1 col-start-1"
            variants={viewAllTextVariants}
            transition={textSwitchTransition}
          >
            View all <ArrowUpRight className="size-4" />
          </motion.span>
        </span>
      </div>
    </motion.div>
  );
}

export { NotificationList };
