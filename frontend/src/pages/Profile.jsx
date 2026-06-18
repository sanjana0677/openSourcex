import React, { useState } from 'react';
import { useGetUserProfile, useUpdateProfile } from '../hooks/useApi.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Skeleton } from '../components/ui/skeleton.jsx';
import { Button } from '../components/ui/button.jsx';
import { User, Mail, Calendar, Github, Shield, Award, Users, Camera, Upload, Trash2, Check, RefreshCw } from 'lucide-react';

export default function Profile() {
  const { data: profile, isLoading } = useGetUserProfile();
  const updateProfileMutation = useUpdateProfile();
  const [showEditAvatar, setShowEditAvatar] = useState(false);
  const [seed, setSeed] = useState(() => Math.random().toString(36).substring(7));

  const presets = [
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Aria-${seed}`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Leo-${seed}`,
    `https://api.dicebear.com/7.x/bottts/svg?seed=Buster-${seed}`,
    `https://api.dicebear.com/7.x/bottts/svg?seed=Sparky-${seed}`,
    `https://api.dicebear.com/7.x/lorelei/svg?seed=Lore-${seed}`,
    `https://api.dicebear.com/7.x/identicon/svg?seed=ident-${seed}`
  ];

  const handleSelectPreset = (url) => {
    updateProfileMutation.mutate({ avatarUrl: url });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      updateProfileMutation.mutate({ avatarUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    updateProfileMutation.mutate({ avatarUrl: null });
  };

  const handleShuffle = () => {
    setSeed(Math.random().toString(36).substring(7));
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Skeleton className="h-40 w-full bg-slate-900 rounded-xl" />
        <Skeleton className="h-48 w-full bg-slate-900 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage and view your linked GitHub profile details.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border-b border-slate-800" />
        <CardContent className="p-6 relative">
          <div className="absolute -top-12 left-6 group">
            <div 
              className="relative w-24 h-24 rounded-full border-4 border-slate-900 bg-slate-900 shadow-xl overflow-hidden cursor-pointer"
              onClick={() => setShowEditAvatar(!showEditAvatar)}
            >
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile?.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-850 flex items-center justify-center text-slate-350 font-extrabold text-3xl">
                  {profile?.username ? profile.username.charAt(0).toUpperCase() : '?'}
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-[10px] font-bold text-white gap-1 select-none">
                <Camera size={18} />
                <span>EDIT</span>
              </div>
            </div>
          </div>

          <div className="pt-14 space-y-6">
            {showEditAvatar && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-200">Customize Avatar</h4>
                  <Button variant="ghost" size="sm" onClick={() => setShowEditAvatar(false)} className="text-slate-400 hover:text-slate-200 h-8 px-2">Close</Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Choose a Preset</span>
                    <button onClick={handleShuffle} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-transparent border-0 cursor-pointer">
                      <RefreshCw size={11} className={updateProfileMutation.isPending ? 'animate-spin' : ''} />
                      Shuffle presets
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {presets.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectPreset(url)}
                        className={`w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-1 transition-all relative overflow-hidden cursor-pointer ${profile?.avatarUrl === url ? 'ring-2 ring-indigo-500 border-transparent' : ''}`}
                        disabled={updateProfileMutation.isPending}
                      >
                        <img src={url} alt={`Preset ${i + 1}`} className="w-full h-full object-contain" />
                        {profile?.avatarUrl === url && (
                          <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                            <Check size={14} className="text-indigo-400 font-black" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-900">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={updateProfileMutation.isPending}
                    />
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900 text-xs font-semibold text-slate-350 hover:text-slate-100 transition-colors">
                      {updateProfileMutation.isPending ? <RefreshCw size={13} className="animate-spin" /> : <Upload size={13} />}
                      Upload Photo
                    </div>
                  </label>

                  {profile?.avatarUrl && (
                    <Button
                      onClick={handleRemoveAvatar}
                      variant="outline"
                      size="sm"
                      className="border-red-950/40 text-red-400 hover:bg-red-950/20 hover:text-red-300 h-8 text-xs font-semibold"
                      disabled={updateProfileMutation.isPending}
                    >
                      <Trash2 size={13} className="mr-1.5" />
                      Remove Photo
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                  {profile?.username}
                </h2>
                <p className="text-sm text-indigo-400 font-medium capitalize mt-0.5">{profile?.role || 'Contributor'}</p>
              </div>

              {profile?.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:text-slate-100 rounded-lg text-sm text-slate-350 transition-colors self-start sm:self-center"
                >
                  <Github size={16} />
                  <span>GitHub Profile</span>
                </a>
              )}
            </div>

            {profile?.bio && (
              <div className="p-4 bg-slate-950/45 rounded-xl border border-slate-850">
                <p className="text-sm text-slate-350 italic leading-relaxed">"{profile.bio}"</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-850">
              <div className="flex items-center gap-3 text-slate-350 text-sm">
                <Mail size={16} className="text-slate-500 shrink-0" />
                <span className="truncate">{profile?.email || 'No email sync\'d'}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-350 text-sm">
                <Calendar size={16} className="text-slate-500 shrink-0" />
                <span>Joined {new Date(profile?.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-350 text-sm">
                <Award size={16} className="text-indigo-400 shrink-0" />
                <span>Contribution Score: <strong className="text-indigo-300 font-black">{profile?.contributionScore ?? 0}</strong></span>
              </div>

              <div className="flex items-center gap-3 text-slate-350 text-sm">
                <Users size={16} className="text-slate-500 shrink-0" />
                <span>{profile?.followers ?? 0} followers &bull; {profile?.following ?? 0} following</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}