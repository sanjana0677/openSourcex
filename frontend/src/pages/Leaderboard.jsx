import React, { useState } from 'react';
import { useGetLeaderboard } from '../hooks/useApi.js';
import { Card, CardContent } from '../components/ui/card.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx';
import { Skeleton } from '../components/ui/skeleton.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table.jsx';
import { Trophy, GitCommit, GitPullRequest, AlertCircle } from 'lucide-react';

const RANK_BADGES = {
  1: 'bg-amber-500/10 text-amber-500 border-amber-500/20 ring-amber-500/30',
  2: 'bg-slate-300/10 text-slate-300 border-slate-300/20 ring-slate-300/30',
  3: 'bg-amber-700/10 text-amber-600 border-amber-700/20 ring-amber-700/30',
};

export default function Leaderboard() {
  const [period, setPeriod] = useState('all-time');
  const { data: leaderboard, isLoading } = useGetLeaderboard({
    period: period === 'all-time' ? undefined : period,
  });

  const top3 = leaderboard?.slice(0, 3) ?? [];
  const otherUsers = leaderboard?.slice(3) ?? [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-slate-400 text-sm mt-1">See how you compare with other open source contributors.</p>
        </div>

        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px] bg-slate-900 border-slate-800 text-slate-200">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent className="bg-slate-950 border-slate-800 text-slate-200">
            <SelectItem value="all-time">All-Time</SelectItem>
            <SelectItem value="monthly">Past Month</SelectItem>
            <SelectItem value="weekly">Past Week</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="bg-slate-900 border-slate-800 h-44">
                <CardContent className="p-6 flex flex-col items-center justify-center space-y-3">
                  <Skeleton className="w-12 h-12 rounded-full bg-slate-800" />
                  <Skeleton className="h-4 w-20 bg-slate-800" />
                  <Skeleton className="h-6 w-16 bg-slate-800" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Skeleton className="h-64 w-full bg-slate-900 rounded" />
        </div>
      ) : !leaderboard || leaderboard.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl">
          <Trophy size={40} className="mx-auto text-slate-650" />
          <h3 className="mt-4 text-base font-semibold text-slate-300">No leaderboard entries</h3>
          <p className="mt-1 text-sm text-slate-500">Wait for users to sync contribution scores.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {top3.map((user) => {
              const ringColor = RANK_BADGES[user.rank] || 'border-slate-850';
              return (
                <Card key={user.userId} className={`bg-slate-900 border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-colors`}>
                  {user.rank === 1 && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full flex items-center justify-center pointer-events-none">
                      <Trophy size={18} className="text-amber-500 translate-x-2 -translate-y-2" />
                    </div>
                  )}
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="relative">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.username}
                          className="w-16 h-16 rounded-full border-2 border-slate-700/60 object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full border-2 border-slate-700/60 bg-slate-850 flex items-center justify-center text-slate-350 font-black text-lg">
                          {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                      <span className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border ring-4 ring-slate-900 ${ringColor}`}>
                        {user.rank}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-200 mt-4 group-hover:text-indigo-400 transition-colors">
                      {user.username}
                    </h3>
                    <p className="text-2xl font-black text-indigo-400 mt-2">
                      {user.contributionScore} <span className="text-[10px] font-medium text-slate-500">score</span>
                    </p>

                    <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-4 border-t border-slate-800/40 text-center text-slate-450 text-[10px]">
                      <div>
                        <p className="font-bold text-slate-300">{user.totalCommits}</p>
                        <p className="text-[9px]">Commits</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-300">{user.totalPullRequests}</p>
                        <p className="text-[9px]">PRs</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-300">{user.totalIssues}</p>
                        <p className="text-[9px]">Issues</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {}
          {otherUsers.length > 0 && (
            <Card className="bg-slate-900 border-slate-800 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-950/40 border-b border-slate-800">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="w-16 text-center text-slate-400 font-mono text-[11px] uppercase">Rank</TableHead>
                    <TableHead className="text-slate-400 font-mono text-[11px] uppercase">Contributor</TableHead>
                    <TableHead className="text-center text-slate-400 font-mono text-[11px] uppercase">Commits</TableHead>
                    <TableHead className="text-center text-slate-400 font-mono text-[11px] uppercase">PRs</TableHead>
                    <TableHead className="text-center text-slate-400 font-mono text-[11px] uppercase">Issues</TableHead>
                    <TableHead className="text-right text-slate-400 font-mono text-[11px] uppercase pr-6">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {otherUsers.map((user) => (
                    <TableRow key={user.userId} className="border-slate-800 hover:bg-slate-850/40">
                      <TableCell className="text-center font-bold text-slate-400 font-mono">
                        {user.rank}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.username}
                              className="w-8 h-8 rounded-full border border-slate-800 object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full border border-slate-800 bg-slate-850 flex items-center justify-center text-slate-350 font-bold text-xs shrink-0">
                              {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                            </div>
                          )}
                          <span className="text-slate-200">{user.username}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-slate-350">{user.totalCommits}</TableCell>
                      <TableCell className="text-center font-semibold text-slate-350">{user.totalPullRequests}</TableCell>
                      <TableCell className="text-center font-semibold text-slate-350">{user.totalIssues}</TableCell>
                      <TableCell className="text-right font-black text-indigo-400 pr-6">{user.contributionScore}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}