import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  LayoutDashboard, 
  Folder, 
  GitCommit, 
  BarChart3, 
  Trophy, 
  Sparkles, 
  FileText, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

export function AppLayout({ children }) {
  const { user, logoutUser } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Repositories', href: '/repos', icon: Folder },
    { name: 'Contributions', href: '/contributions', icon: GitCommit },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'AI Insights', href: '/insights', icon: Sparkles },
    { name: 'PDF Reports', href: '/reports', icon: FileText },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <Link to="/dashboard" className="text-xl font-bold tracking-tight text-indigo-400">
          OpenSourceX
        </Link>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-200 focus:outline-none"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:flex md:flex-col transition-transform duration-200 ease-in-out
      `}>
        {}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <Link to="/dashboard" className="text-2xl font-black tracking-wider text-indigo-400">
            OSX
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1 rounded-md text-slate-400 hover:text-slate-200 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        {}
        {user && (
          <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3">
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.username}
                className="w-10 h-10 rounded-full border border-indigo-500/50 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full border border-indigo-500/50 bg-slate-850 flex items-center justify-center text-slate-350 font-bold text-sm shrink-0">
                {user.username ? user.username.charAt(0).toUpperCase() : '?'}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.username}</p>
              <p className="text-xs text-slate-400 capitalize">{user.role || 'Contributor'}</p>
            </div>
          </div>
        )}

        {}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${active 
                    ? 'bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-500' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
                `}
              >
                <Icon size={18} className={active ? 'text-indigo-400' : 'text-slate-400'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logoutUser}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-x-hidden">
        {}
        <header className="hidden md:flex h-16 items-center justify-end px-8 border-b border-slate-900 bg-slate-950/50 backdrop-blur sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Link to="/notifications" className="relative p-1.5 rounded-full text-slate-400 hover:text-slate-200 transition-colors hover:bg-slate-900">
              <Bell size={20} />
              {user?.unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              )}
            </Link>
            <div className="w-px h-6 bg-slate-800" />
            <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              {user?.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user?.username}
                  className="w-8 h-8 rounded-full border border-indigo-500/30 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full border border-indigo-500/30 bg-slate-850 flex items-center justify-center text-slate-350 font-bold text-xs shrink-0">
                  {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
                </div>
              )}
              <span className="text-sm font-medium text-slate-300">{user?.username}</span>
            </Link>
          </div>
        </header>

        {}
        <div className="p-6 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
