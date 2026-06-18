import React from 'react';
import { useGetInsights } from '../hooks/useApi.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Skeleton } from '../components/ui/skeleton.jsx';
import { Progress } from '../components/ui/progress.jsx';
import { Sparkles, CheckCircle2, ArrowRightCircle, AlertTriangle, Lightbulb } from 'lucide-react';

export default function Insights() {
  const { data: insights, isLoading } = useGetInsights();

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/3 bg-slate-900" />
          <Skeleton className="h-4 w-2/3 bg-slate-900" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 bg-slate-900 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-40 w-full bg-slate-900 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="text-indigo-400" />
          AI Insights
        </h1>
        <p className="text-slate-400 text-sm mt-1">Personalized productivity metrics and smart feedback on your coding habit.</p>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {}
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>Productivity</span>
              <span className="text-indigo-450 font-bold font-mono">{insights?.productivityScore ?? 0}%</span>
            </div>
            <Progress value={insights?.productivityScore ?? 0} className="h-2 bg-slate-950" />
            <p className="text-xs text-slate-400">Calculated from recent contribution activity over the past 30 days.</p>
          </CardContent>
        </Card>

        {}
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>Impact</span>
              <span className="text-indigo-450 font-bold font-mono">{insights?.impactScore ?? 0}%</span>
            </div>
            <Progress value={insights?.impactScore ?? 0} className="h-2 bg-slate-950" />
            <p className="text-xs text-slate-400">Based on merged pull requests and total active code changes.</p>
          </CardContent>
        </Card>

        {}
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>Consistency</span>
              <span className="text-indigo-450 font-bold font-mono">{insights?.consistencyScore ?? 0}%</span>
            </div>
            <Progress value={insights?.consistencyScore ?? 0} className="h-2 bg-slate-950" />
            <p className="text-xs text-slate-400">Evaluates coding frequencies and daily streak density ratios.</p>
          </CardContent>
        </Card>
      </div>

      {}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb size={18} className="text-indigo-400" />
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <p className="text-slate-350 leading-relaxed text-sm bg-slate-950/40 p-4 rounded-xl border border-slate-850">
            {insights?.summary}
          </p>
        </CardContent>
      </Card>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-3 border-b border-slate-850">
            <CardTitle className="text-lg font-semibold">Strengths & Focus</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">Key Strengths</h3>
              <div className="space-y-3">
                {insights?.strengths?.map((str, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-slate-300 text-sm">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            </div>

            {}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">Next Steps</h3>
              <div className="space-y-3">
                {insights?.recommendations?.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-slate-300 text-sm">
                    <ArrowRightCircle size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-3 border-b border-slate-850">
            <CardTitle className="text-lg font-semibold">Areas of Improvement</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">Identified Areas</h3>
              {insights?.improvements?.length === 0 ? (
                <div className="flex items-center gap-2.5 text-slate-400 text-sm">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Doing great! No major optimization areas identified.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {insights?.improvements?.map((imp, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-slate-300 text-sm">
                      <AlertTriangle size={16} className="text-yellow-500 shrink-0" />
                      <span>{imp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}