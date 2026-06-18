import React, { useState } from 'react';
import { useListContributions } from '../hooks/useApi.js';
import { Card, CardContent } from '../components/ui/card.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx';
import { Skeleton } from '../components/ui/skeleton.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { GitCommit, GitPullRequest, AlertCircle, Users, ExternalLink, Calendar } from 'lucide-react';

const TYPE_ICON = {
  commit: GitCommit,
  pull_request: GitPullRequest,
  issue: AlertCircle,
  review: Users,
};

const TYPE_COLOR = {
  commit: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  pull_request: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  issue: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  review: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

const STATUS_COLOR = {
  merged: 'bg-green-500/20 text-green-400 border-green-500/30',
  open: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  closed: 'bg-slate-800 text-slate-400 border-slate-700',
};

export default function Contributions() {
  const [type, setType] = useState('ALL');

  const { data: contributions, isLoading } = useListContributions({
    type: type === 'ALL' ? undefined : type,
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contribution History</h1>
          <p className="text-slate-400 text-sm mt-1">Detailed list of your commits, pull requests, issues, and reviews.</p>
        </div>

        {}
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[180px] bg-slate-900 border-slate-800 text-slate-200">
            <SelectValue placeholder="Filter By Type" />
          </SelectTrigger>
          <SelectContent className="bg-slate-950 border-slate-800 text-slate-200">
            <SelectItem value="ALL">All Contributions</SelectItem>
            <SelectItem value="commit">Commits</SelectItem>
            <SelectItem value="pull_request">Pull Requests</SelectItem>
            <SelectItem value="issue">Issues</SelectItem>
            <SelectItem value="review">Reviews</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between px-6">
              <div className="flex items-center gap-4 flex-1">
                <Skeleton className="w-8 h-8 rounded bg-slate-800" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3 bg-slate-800" />
                  <Skeleton className="h-3 w-1/4 bg-slate-800" />
                </div>
              </div>
              <Skeleton className="w-12 h-6 bg-slate-800" />
            </div>
          ))}
        </div>
      ) : !contributions || contributions.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl">
          <Calendar size={40} className="mx-auto text-slate-600" />
          <h3 className="mt-4 text-base font-semibold text-slate-300">No contributions found</h3>
          <p className="mt-1 text-sm text-slate-500">Sync your GitHub profile to see recent data.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contributions.map((item) => {
            const Icon = TYPE_ICON[item.type] || GitCommit;
            const typeColor = TYPE_COLOR[item.type] || 'bg-slate-800 text-slate-400 border-slate-700';

            
            let statusText = null;
            let statusColorClass = '';
            if (item.type === 'pull_request') {
              statusText = item.merged ? 'Merged' : item.state === 'closed' ? 'Closed' : 'Open';
              statusColorClass = item.merged ? STATUS_COLOR.merged : item.state === 'closed' ? STATUS_COLOR.closed : STATUS_COLOR.open;
            } else if (item.type === 'issue') {
              statusText = item.state === 'closed' ? 'Closed' : 'Open';
              statusColorClass = item.state === 'closed' ? STATUS_COLOR.closed : STATUS_COLOR.open;
            }

            return (
              <Card key={item.id} className="bg-slate-900 border-slate-800 hover:border-slate-750 transition-colors">
                <CardContent className="p-4 flex items-center justify-between gap-6">
                  {}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`p-2.5 rounded-lg border ${typeColor} shrink-0`}>
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-200 truncate pr-2">
                        {item.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="font-medium text-slate-400">{item.repoOwner}/{item.repoName}</span>
                        <span>&bull;</span>
                        <span>{new Date(item.createdAt).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="flex items-center gap-3 shrink-0">
                    {statusText && (
                      <Badge variant="outline" className={`text-[10px] px-2 py-0.5 border font-semibold ${statusColorClass}`}>
                        {statusText}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-slate-950 border-slate-800 text-slate-400 font-semibold capitalize">
                      {item.type}
                    </Badge>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}