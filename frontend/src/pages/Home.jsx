import { SiGithub } from 'react-icons/si';
import { Button } from '../components/ui/button.jsx';
import { ArrowRight, BarChart2, GitPullRequest, LayoutDashboard, Zap, Shield, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api`;

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/github`;
  };

  const features = [
    { icon: LayoutDashboard, title: 'Dashboard', desc: 'See your commits, PRs, and streak at a glance.' },
    { icon: BarChart2, title: 'Deep Analytics', desc: 'Visual charts for languages, monthly activity, and contribution trends.' },
    { icon: GitPullRequest, title: 'PR Life Cycle', desc: 'Track all opened and merged pull requests across repositories.' },
    { icon: Zap, title: 'Streak Tracking', desc: 'Keep your coding habits alive with current and longest streak tracking.' },
    { icon: Activity, title: 'Activity Timeline', desc: 'Detailed chronology of all your recent GitHub interactions.' },
    { icon: Shield, title: 'PDF Reports', desc: 'Download simple PDF reports summarizing your open source footprint.' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-indigo-400">OpenSourceX</span>
          <Button onClick={handleLogin} variant="outline" className="flex items-center gap-2 border-slate-800 hover:bg-slate-900 text-slate-200">
            <SiGithub />
            <span>Sign In</span>
          </Button>
        </div>
      </nav>

      {}
      <main className="max-w-7xl mx-auto px-6 py-20 flex-1 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-6">
          <Zap size={14} />
          <span>Open Source Analytics for Students</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight">
          Supercharge Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Open Source</span> Journey
        </h1>
        <p className="mt-6 text-lg text-slate-400 max-w-xl">
          Connect your GitHub account to sync, analyze, and showcase your open source contributions in one clean developer portfolio.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleLogin} size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 flex items-center gap-3">
            <SiGithub size={20} />
            Connect GitHub
            <ArrowRight size={18} />
          </Button>
        </div>

        {}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl text-left">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/30 transition-all group">
                <div className="w-10 h-10 rounded-lg bg-indigo-600/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:bg-indigo-600/20 group-hover:text-indigo-300 transition-colors">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-200">{feat.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </section>
      </main>

      {}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} OpenSourceX. Built for developers.</p>
      </footer>
    </div>
  );
}