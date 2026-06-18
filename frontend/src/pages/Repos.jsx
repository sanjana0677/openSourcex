import React, { useState } from 'react';
import { useListRepos } from '../hooks/useApi.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Input } from '../components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx';
import { Skeleton } from '../components/ui/skeleton.jsx';
import { Star, GitFork, AlertCircle, GitCommit, GitPullRequest, Search, Folder, ExternalLink } from 'lucide-react';

const LANG_COLORS = {
  JavaScript: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  TypeScript: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Python: 'bg-green-500/20 text-green-400 border-green-500/30',
  HTML: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  CSS: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Go: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Rust: 'bg-amber-700/20 text-amber-500 border-amber-600/30',
  default: 'bg-slate-800 text-slate-400 border-slate-700',
};

export default function Repos() {
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('ALL');
  const [sortBy, setSortBy] = useState('updatedAt');

  const { data: repos, isLoading } = useListRepos({
    search: search || undefined,
    language: language === 'ALL' ? undefined : language,
    sort: sortBy,
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
        <p className="text-slate-400 text-sm mt-1">Manage and inspect synced repositories from your GitHub account.</p>
      </div>

      {}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/40 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search repositories..."
            className="pl-9 bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          {}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[140px] bg-slate-950 border-slate-800 text-slate-200">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="bg-slate-950 border-slate-800 text-slate-200">
              <SelectItem value="ALL">All Languages</SelectItem>
              <SelectItem value="JavaScript">JavaScript</SelectItem>
              <SelectItem value="TypeScript">TypeScript</SelectItem>
              <SelectItem value="Python">Python</SelectItem>
              <SelectItem value="Go">Go</SelectItem>
              <SelectItem value="Rust">Rust</SelectItem>
              <SelectItem value="HTML">HTML</SelectItem>
              <SelectItem value="CSS">CSS</SelectItem>
            </SelectContent>
          </Select>

          {}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px] bg-slate-950 border-slate-800 text-slate-200">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-slate-950 border-slate-800 text-slate-200">
              <SelectItem value="updatedAt">Recently Updated</SelectItem>
              <SelectItem value="stars">Stars</SelectItem>
              <SelectItem value="commits">Commits</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-1/3 bg-slate-800" />
                <Skeleton className="h-4 w-2/3 bg-slate-800 mt-1" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full bg-slate-800" />
                <Skeleton className="h-4 w-1/4 bg-slate-800" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !repos || repos.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl">
          <Folder size={40} className="mx-auto text-slate-600" />
          <h3 className="mt-4 text-base font-semibold text-slate-300">No repositories found</h3>
          <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {repos.map((repo) => {
            const langColorClass = LANG_COLORS[repo.language] || LANG_COLORS.default;
            return (
              <Card key={repo.id} className="bg-slate-900 border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col justify-between group">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg font-bold truncate text-slate-100 group-hover:text-indigo-400 transition-colors">
                      {repo.repoName}
                    </CardTitle>
                    <a
                      href={`https://github.com/${repo.owner}/${repo.repoName}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-850 transition-colors shrink-0"
                    >
                      <ExternalLink size={15} />
                    </a>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">by {repo.owner}</p>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-sm text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {repo.description || 'No description provided.'}
                  </p>

                  <div className="space-y-3 pt-4 border-t border-slate-800/40">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      {}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${langColorClass}`}>
                        {repo.language || 'Unknown'}
                      </span>

                      {}
                      <span className="text-[10px] text-slate-500 font-mono">
                        Updated {new Date(repo.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {}
                    <div className="grid grid-cols-5 gap-2 text-center text-xs text-slate-400 bg-slate-950/40 p-2 rounded-lg border border-slate-850">
                      <div className="flex flex-col items-center justify-center">
                        <Star size={13} className="text-amber-500 mb-0.5" />
                        <span className="font-bold text-slate-300">{repo.stars}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <GitFork size={13} className="text-blue-400 mb-0.5" />
                        <span className="font-bold text-slate-300">{repo.forks}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle size={13} className="text-red-400 mb-0.5" />
                        <span className="font-bold text-slate-300">{repo.openIssues}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <GitCommit size={13} className="text-indigo-400 mb-0.5" />
                        <span className="font-bold text-slate-300">{repo.commitCount}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <GitPullRequest size={13} className="text-purple-400 mb-0.5" />
                        <span className="font-bold text-slate-300">{repo.pullRequestCount}</span>
                      </div>
                    </div>
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