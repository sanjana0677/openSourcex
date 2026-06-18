import React, { useState } from 'react';
import { useListReports, useGenerateReport, getListReportsQueryKey } from '../hooks/useApi.js';
import api from '../services/api.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx';
import { Skeleton } from '../components/ui/skeleton.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { FileText, Download, Loader2, Plus, Calendar } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function Reports() {
  const queryClient = useQueryClient();
  const [format, setFormat] = useState('pdf');
  const [period, setPeriod] = useState('all_time');
  const [downloadingId, setDownloadingId] = useState(null);

  const { data: reports, isLoading } = useListReports();
  const generateMutation = useGenerateReport();

  const handleGenerate = () => {
    generateMutation.mutate(
      { data: { format, period } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListReportsQueryKey() });
        },
      }
    );
  };

  const handleDownload = async (reportId, reportFormat) => {
    setDownloadingId(reportId);
    try {
      const res = await api.get(`/reports/${reportId}/download`, {
        responseType: 'blob',
      });
      const contentType = reportFormat === 'pdf' ? 'application/pdf' : 'text/csv';
      const blob = new Blob([res.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `opensourcex_report_${reportId}.${reportFormat}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Failed to download report', err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">PDF & CSV Reports</h1>
        <p className="text-slate-400 text-sm mt-1">Export your contribution footprint as formatted documents.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {}
        <Card className="bg-slate-900 border-slate-800 md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Plus size={18} className="text-indigo-400" />
              Generate Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Format</label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-200">
                  <SelectValue placeholder="Select Format" />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border-slate-800 text-slate-200">
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Period</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-200">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border-slate-800 text-slate-200">
                  <SelectItem value="all_time">All Time</SelectItem>
                  <SelectItem value="year">Past Year</SelectItem>
                  <SelectItem value="quarter">Past Quarter</SelectItem>
                  <SelectItem value="month">Past Month</SelectItem>
                  <SelectItem value="week">Past Week</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2 mt-2"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText size={16} />
                  Generate Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {}
        <Card className="bg-slate-900 border-slate-800 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Report History</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full bg-slate-950" />
                ))}
              </div>
            ) : !reports || reports.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-sm">
                No reports generated yet. Use the tool on the left to create one.
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 bg-slate-950/40 rounded-xl border border-slate-850 hover:border-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
                        <FileText size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-200">
                            Report #{report.id.slice(-6).toUpperCase()}
                          </span>
                          <Badge className="text-[9px] font-bold uppercase py-0 px-2 bg-slate-900 border-slate-800 text-slate-400">
                            {report.format}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          Created {new Date(report.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleDownload(report.id, report.format)}
                      disabled={downloadingId === report.id}
                      variant="outline"
                      className="border-slate-800 hover:bg-slate-900 text-slate-350 hover:text-slate-250 flex items-center gap-1.5 px-3 py-1.5 h-8 text-xs font-semibold"
                    >
                      {downloadingId === report.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Download size={13} />
                      )}
                      <span>Download</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}