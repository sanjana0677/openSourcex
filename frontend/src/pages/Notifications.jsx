import React from 'react';
import { useListNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, getListNotificationsQueryKey, getGetMeQueryKey } from '../hooks/useApi.js';
import { Card, CardContent } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Skeleton } from '../components/ui/skeleton.jsx';
import { Bell, Check, CheckCheck, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function Notifications() {
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useListNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const handleMarkRead = (id) => {
    markReadMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        },
      }
    );
  };

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      },
    });
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-slate-400 text-sm mt-1">Keep track of sync completion reports and achievements.</p>
        </div>

        {notifications && notifications.some((n) => !n.isRead) && (
          <Button
            onClick={handleMarkAllRead}
            disabled={markAllReadMutation.isPending}
            variant="outline"
            className="border-slate-800 hover:bg-slate-900 text-slate-300 flex items-center gap-1.5 self-start text-xs font-semibold"
          >
            {markAllReadMutation.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <CheckCheck size={14} />
            )}
            <span>Mark all read</span>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full bg-slate-900 rounded-xl" />
          ))}
        </div>
      ) : !notifications || notifications.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl">
          <Bell size={40} className="mx-auto text-slate-650" />
          <h3 className="mt-4 text-base font-semibold text-slate-300">Clean inbox!</h3>
          <p className="mt-1 text-sm text-slate-500">You don't have any notifications right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <Card
              key={item.id}
              className={`border-slate-850 transition-colors ${
                item.isRead ? 'bg-slate-900/40 text-slate-400' : 'bg-slate-900 text-slate-200 border-indigo-500/20'
              }`}
            >
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      item.isRead
                        ? 'bg-slate-950 text-slate-500 border border-slate-850'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}
                  >
                    <Bell size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-relaxed break-words">{item.message}</p>
                    <p className="text-[10px] text-slate-550 font-mono mt-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {!item.isRead && (
                  <Button
                    onClick={() => handleMarkRead(item.id)}
                    disabled={markReadMutation.isPending}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-slate-200 hover:bg-slate-800 shrink-0"
                  >
                    <Check size={16} />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}