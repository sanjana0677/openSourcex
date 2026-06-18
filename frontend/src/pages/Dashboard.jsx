import React from 'react';
import { useGetUserStats, useGetHeatmap, useGetActivityTimeline, useSyncGitHub, getGetUserStatsQueryKey } from '../hooks/useApi.js';
import { ContributionHeatmap } from '../components/ContributionHeatmap.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Skeleton } from '../components/ui/skeleton.jsx';
import { GitCommit, GitPullRequest, AlertCircle, Folder, Flame, Trophy, Users, RefreshCw, Loader2, ExternalLink } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext.jsx';

const TYPE_ICON = {
  commit: GitCommit,
  pull_request_opened: GitPullRequest,
  pull_request_merged: GitPullRequest,
  issue_created: AlertCircle,
  issue_closed: AlertCircle,
  review_submitted: Users,
};

const TYPE_COLOR = {
  commit: 'text-blue-400',
  pull_request_opened: 'text-purple-400',
  pull_request_merged: 'text-green-400',
  issue_created: 'text-yellow-400',
  issue_closed: 'text-slate-500',
  review_submitted: 'text-cyan-400',
};

const TYPE_LABEL = {
  commit: 'Commit',
  pull_request_opened: 'PR Opened',
  pull_request_merged: 'PR Merged',
  issue_created: 'Issue',
  issue_closed: 'Closed',
  review_submitted: 'Review',
};

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useGetUserStats();
  const { data: heatmap } = useGetHeatmap();
  const { data: activity, isLoading: activityLoading } = useGetActivityTimeline({ limit: 10 });
  const syncMutation = useSyncGitHub();

  const handleSync = () => {
    syncMutation.mutate(undefined, {
      onSuccess: () => {
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: getGetUserStatsQueryKey() });
          queryClient.invalidateQueries({ queryKey: ['analytics'] });
          queryClient.invalidateQueries({ queryKey: ['repos'] });
          queryClient.invalidateQueries({ queryKey: ['contributions'] });
        }, 1500);
      },
    });
  };

  const statCards = [
    { label: 'Commits', value: stats?.totalCommits ?? 0, icon: GitCommit, color: 'text-blue-400' },
    { label: 'Pull Requests', value: stats?.totalPullRequests ?? 0, icon: GitPullRequest, color: 'text-purple-400' },
    { label: 'Issues Tracked', value: stats?.totalIssues ?? 0, icon: AlertCircle, color: 'text-yellow-400' },
    { label: 'Repositories', value: stats?.totalRepos ?? 0, icon: Folder, color: 'text-green-400' },
    { label: 'Current Streak', value: stats?.currentStreak ?? 0, icon: Flame, color: 'text-orange-500' },
    { label: 'Longest Streak', value: stats?.longestStreak ?? 0, icon: Trophy, color: 'text-amber-400' },
    { label: 'Contribution Score', value: stats?.contributionScore ?? 0, icon: Users, color: 'text-indigo-400' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Hello, {user?.username}. Here is your contribution snapshot.</p>
        </div>
        <Button
          onClick={handleSync}
          disabled={syncMutation.isPending}
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 self-start"
        >
          {syncMutation.isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw size={16} />
              Sync GitHub Data
            </>
          )}
        </Button>
      </div>

      {}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {statsLoading
          ? Array.from({ length: 7 }).map((_, i) => (
              <Card key={i} className="bg-slate-900 border-slate-800">
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-12 bg-slate-800" />
                  <Skeleton className="h-8 w-16 bg-slate-800" />
                </CardContent>
              </Card>
            ))
          : statCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.label} className="bg-slate-900 border-slate-800 hover:border-indigo-500/30 transition-colors">
                  <CardContent className="p-4 flex flex-col justify-between h-24">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-[11px] font-medium uppercase tracking-wider">{card.label}</span>
                      <Icon size={16} className={card.color} />
                    </div>
                    <span className="text-2xl font-bold text-slate-100">{card.value}</span>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-3 border-b border-slate-800/60">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Flame size={18} className="text-orange-500" />
            Contribution Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ContributionHeatmap data={heatmap} />
        </CardContent>
      </Card>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {}
        <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
          <CardHeader className="pb-3 border-b border-slate-800/60">
            <CardTitle className="text-lg font-semibold">Recent Interactions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {activityLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-slate-800" />
                ))}
              </div>
            ) : !activity || activity.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                No recent activity. Try syncing your GitHub data.
              </div>
            ) : (
              <div className="space-y-6">
                {activity.map((item) => {
                  const Icon = TYPE_ICON[item.type] || GitCommit;
                  return (
                    <div key={item.id} className="flex gap-4 items-start pb-4 border-b border-slate-800/40 last:border-0 last:pb-0">
                      <div className={`p-2 rounded-lg bg-slate-950/60 ${TYPE_COLOR[item.type] || 'text-slate-400'}`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <p className="text-sm font-semibold text-slate-200 truncate">
                            {item.title}
                          </p>
                          <Badge variant="outline" className="text-[10px] uppercase border-slate-800 bg-slate-950 text-slate-400 shrink-0">
                            {TYPE_LABEL[item.type] || 'Event'}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                          <span>{item.repoOwner}/{item.repoName}</span>
                          <span>&bull;</span>
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </p>
                      </div>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors shrink-0"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-3 border-b border-slate-800/60">
            <CardTitle className="text-lg font-semibold">GitHub Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center text-center">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user?.username}
                className="w-20 h-20 rounded-full border-2 border-indigo-500/40 shadow-xl object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-2 border-indigo-500/40 shadow-xl bg-slate-850 border-slate-750 flex items-center justify-center text-slate-300 font-extrabold text-2xl">
                {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
              </div>
            )}
            <h3 className="text-lg font-bold text-slate-200 mt-4">{user?.username}</h3>
            <p className="text-xs text-indigo-400 capitalize">{user?.role || 'Contributor'}</p>
            {user?.bio ? (
              <p className="text-sm text-slate-400 mt-3 italic line-clamp-3">"{user.bio}"</p>
            ) : (
              <p className="text-xs text-slate-500 mt-3">No GitHub bio sync'd.</p>
            )}

            <div className="w-full grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800/60 text-center">
              <div>
                <p className="text-xl font-bold text-slate-100">{user?.followers ?? 0}</p>
                <p className="text-xs text-slate-500">Followers</p>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-100">{user?.following ?? 0}</p>
                <p className="text-xs text-slate-500">Following</p>
              </div>
            </div>

            {user?.githubUrl && (
              <a
                href={user.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-800 hover:border-slate-700 bg-slate-950/40 rounded-lg text-sm text-slate-300 hover:text-slate-100 transition-colors"
              >
                <span>Visit GitHub Profile</span>
                <ExternalLink size={14} />
              </a>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}