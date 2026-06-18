import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { TooltipProvider } from './components/ui/tooltip';
import { ThemeProvider } from 'next-themes';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Repos from './pages/Repos';
import Contributions from './pages/Contributions';
import Analytics from './pages/Analytics';
import Leaderboard from './pages/Leaderboard';
import Insights from './pages/Insights';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/Layout';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
                <Route path="/repos" element={<ProtectedPage><Repos /></ProtectedPage>} />
                <Route path="/contributions" element={<ProtectedPage><Contributions /></ProtectedPage>} />
                <Route path="/analytics" element={<ProtectedPage><Analytics /></ProtectedPage>} />
                <Route path="/leaderboard" element={<ProtectedPage><Leaderboard /></ProtectedPage>} />
                <Route path="/insights" element={<ProtectedPage><Insights /></ProtectedPage>} />
                <Route path="/reports" element={<ProtectedPage><Reports /></ProtectedPage>} />
                <Route path="/notifications" element={<ProtectedPage><Notifications /></ProtectedPage>} />
                <Route path="/profile" element={<ProtectedPage><Profile /></ProtectedPage>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
