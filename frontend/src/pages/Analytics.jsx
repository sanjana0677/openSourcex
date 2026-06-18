import React from 'react';
import { useGetMonthlyAnalytics, useGetLanguageStats, useGetStreakStats, useGetActivityTimeline } from '../hooks/useApi.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Skeleton } from '../components/ui/skeleton.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { GitCommit, GitPullRequest, Flame, Calendar, TrendingUp } from 'lucide-react';

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#ef4444', '#f59e0b', '#ec4899', '#14b8a6'];

const TOOLTIP_STYLE = {
  backgroundColor: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: '8px',
  color: '#f8fafc',
  fontFamily: 'monospace',
  fontSize: '12px',
};

function buildDailyActivity(events) {
  if (!events) return [];
  const counts = new Map();
  
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    counts.set(dateStr, 0);
  }

  events.forEach((e) => {
    const dateStr = new Date(e.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (counts.has(dateStr)) {
      counts.set(dateStr, counts.get(dateStr) + 1);
    }
  });

  return Array.from(counts.entries()).map(([date, count]) => ({ date, count }));
}

export default function Analytics() {
  const { data: monthly, isLoading: monthlyLoading } = useGetMonthlyAnalytics();
  const { data: languages, isLoading: langLoading } = useGetLanguageStats();
  const { data: streaks, isLoading: streaksLoading } = useGetStreakStats();
  const { data: activity, isLoading: activityLoading } = useGetActivityTimeline({ limit: 100 });

  const streakCards = [
    { label: 'Current Streak', value: streaks?.currentStreak ?? 0, unit: 'days', icon: Flame, color: 'text-orange-500' },
    { label: 'Longest Streak', value: streaks?.longestStreak ?? 0, unit: 'days', icon: TrendingUp, color: 'text-amber-400' },
    { label: 'Total Active Days', value: streaks?.totalActiveDays ?? 0, unit: 'days', icon: Calendar, color: 'text-indigo-400' },
  ];

  const dailyData = buildDailyActivity(activity);

  const showLoading = monthlyLoading || langLoading || streaksLoading || activityLoading;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Trends</h1>
        <p className="text-slate-400 text-sm mt-1">Insights into your coding patterns, languages, and contribution trends.</p>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {showLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-20 bg-slate-800" />
                  <Skeleton className="h-10 w-24 bg-slate-800 mt-2" />
                </CardContent>
              </Card>
            ))
          : streakCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.label} className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{card.label}</p>
                      <p className="text-3xl font-extrabold text-slate-100 mt-1">
                        {card.value} <span className="text-sm font-medium text-slate-400">{card.unit}</span>
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl bg-slate-950/60 border border-slate-850 ${card.color}`}>
                      <Icon size={24} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <GitPullRequest size={18} className="text-purple-400" />
              Monthly Activity Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-[300px]">
            {showLoading ? (
              <Skeleton className="w-full h-full bg-slate-800 rounded" />
            ) : !monthly || monthly.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-500 text-sm">No monthly data available.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend verticalAlign="top" height={36} iconSize={12} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="commits" name="Commits" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pullRequests" name="PRs" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="issues" name="Issues" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <GitCommit size={18} className="text-blue-400" />
              Language Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-[300px] flex flex-col md:flex-row items-center justify-center gap-6">
            {showLoading ? (
              <Skeleton className="w-full h-full bg-slate-800 rounded" />
            ) : !languages || languages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-500 text-sm">No language data available.</div>
            ) : (
              <>
                <div className="w-full md:w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={languages}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="language"
                      >
                        {languages.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => [`${value} repos`, 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-2 max-h-full overflow-y-auto pr-2">
                  {languages.slice(0, 5).map((lang, index) => (
                    <div key={lang.language} className="flex items-center justify-between text-xs bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                        />
                        <span className="font-semibold text-slate-300">{lang.language}</span>
                      </div>
                      <span className="text-slate-400 font-mono">{lang.percentage}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">14-Day Activity Velocity</CardTitle>
        </CardHeader>
        <CardContent className="p-4 h-[250px]">
          {showLoading ? (
            <Skeleton className="w-full h-full bg-slate-800 rounded" />
          ) : dailyData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-500 text-sm">No activity velocity data available.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="count" name="Contributions" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}