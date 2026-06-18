import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api.js';


export const getGetMeQueryKey = () => ['auth', 'me'];

export function useGetMe(options = {}) {
  return useQuery({
    queryKey: getGetMeQueryKey(),
    queryFn: async () => {
      const { data } = await api.get('/auth/me');
      return data;
    },
    retry: false,
    ...options,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/auth/logout');
      return data;
    },
  });
}


export const getGetUserProfileQueryKey = () => ['users', 'profile'];

export function useGetUserProfile() {
  return useQuery({
    queryKey: getGetUserProfileQueryKey(),
    queryFn: async () => {
      const { data } = await api.get('/users/profile');
      return data;
    },
  });
}

export function useUpdateProfile(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body) => {
      const { data } = await api.put('/users/profile', body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetUserProfileQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    },
    ...options,
  });
}

export const getGetUserStatsQueryKey = () => ['users', 'stats'];

export function useGetUserStats() {
  return useQuery({
    queryKey: getGetUserStatsQueryKey(),
    queryFn: async () => {
      const { data } = await api.get('/users/stats');
      return data;
    },
  });
}

export function useSyncGitHub() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/users/sync');
      return data;
    },
  });
}


export function useListRepos(params = {}) {
  return useQuery({
    queryKey: ['repos', params],
    queryFn: async () => {
      const { data } = await api.get('/repos', { params });
      return data;
    },
  });
}


export function useListContributions(params = {}) {
  return useQuery({
    queryKey: ['contributions', params],
    queryFn: async () => {
      const { data } = await api.get('/contributions', { params });
      return data;
    },
  });
}


export function useGetHeatmap() {
  return useQuery({
    queryKey: ['analytics', 'heatmap'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/heatmap');
      return data;
    },
  });
}

export function useGetMonthlyAnalytics(params = {}) {
  return useQuery({
    queryKey: ['analytics', 'monthly', params],
    queryFn: async () => {
      const { data } = await api.get('/analytics/monthly', { params });
      return data;
    },
  });
}

export function useGetLanguageStats() {
  return useQuery({
    queryKey: ['analytics', 'languages'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/languages');
      return data;
    },
  });
}

export function useGetActivityTimeline(params = {}) {
  return useQuery({
    queryKey: ['analytics', 'activity', params],
    queryFn: async () => {
      const { data } = await api.get('/analytics/activity', { params });
      return data;
    },
  });
}

export function useGetStreakStats() {
  return useQuery({
    queryKey: ['analytics', 'streaks'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/streaks');
      return data;
    },
  });
}


export function useGetLeaderboard(params = {}) {
  return useQuery({
    queryKey: ['leaderboard', params],
    queryFn: async () => {
      const { data } = await api.get('/leaderboard', { params });
      return data;
    },
  });
}


export function useGetInsights() {
  return useQuery({
    queryKey: ['insights'],
    queryFn: async () => {
      const { data } = await api.get('/insights');
      return data;
    },
  });
}


export const getListNotificationsQueryKey = () => ['notifications'];

export function useListNotifications() {
  return useQuery({
    queryKey: getListNotificationsQueryKey(),
    queryFn: async () => {
      const { data } = await api.get('/notifications');
      return data;
    },
  });
}

export function useMarkNotificationRead() {
  return useMutation({
    mutationFn: async ({ id }) => {
      const { data } = await api.patch(`/notifications/${id}/read`);
      return data;
    },
  });
}

export function useMarkAllNotificationsRead() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/notifications/read-all');
      return data;
    },
  });
}


export const getListReportsQueryKey = () => ['reports'];

export function useListReports() {
  return useQuery({
    queryKey: getListReportsQueryKey(),
    queryFn: async () => {
      const { data } = await api.get('/reports');
      return data;
    },
  });
}

export function useGenerateReport(options = {}) {
  return useMutation({
    mutationFn: async ({ data: body }) => {
      const { data } = await api.post('/reports/generate', body);
      return data;
    },
    ...options?.mutation,
  });
}
