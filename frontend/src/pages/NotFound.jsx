import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6">
      <div className="p-4 bg-red-500/10 text-red-400 rounded-full border border-red-500/20 mb-6">
        <AlertCircle size={40} />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-100">404 - Page Not Found</h1>
      <p className="text-slate-400 mt-3 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white mt-8 px-6 font-semibold">
        <Link to="/dashboard">Go back to Dashboard</Link>
      </Button>
    </div>
  );
}
