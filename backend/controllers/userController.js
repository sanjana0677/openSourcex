import User from '../models/User.js';
import Contribution from '../models/Contribution.js';
import Repository from '../models/Repository.js';
import { syncUserData } from '../services/githubApi.js';

export const getProfile = async (req, res) => {
  const user = await User.findById(req.userId).select('-githubAccessToken');
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({
    id: user._id,
    githubId: user.githubId,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    followers: user.followers,
    following: user.following,
    githubUrl: user.githubUrl,
    role: user.role,
    contributionScore: user.contributionScore,
    createdAt: user.createdAt,
  });
};

export const getStats = async (req, res) => {
  const userId = req.userId;

  const user = await User.findById(userId).select('followers following contributionScore');

  const commitCount = await Contribution.countDocuments({ userId });
  const prCount = await Contribution.countDocuments({ userId, type: 'pull_request' });
  const issueCount = await Contribution.countDocuments({ userId, type: 'issue' });
  const repoCount = await Repository.countDocuments({ userId });

  const contributions = await Contribution.find({ userId })
    .select('contributionDate')
    .sort({ contributionDate: -1 });

  const { currentStreak, longestStreak } = calculateStreaks(contributions.map((c) => c.contributionDate));

  res.json({
    totalCommits: commitCount,
    totalPullRequests: prCount,
    totalIssues: issueCount,
    totalRepos: repoCount,
    currentStreak,
    longestStreak,
    contributionScore: user?.contributionScore ?? 0,
    followers: user?.followers ?? 0,
    following: user?.following ?? 0,
  });
};

export const syncGitHub = async (req, res) => {
  
  syncUserData(req.userId);
  res.json({ message: 'GitHub sync started', syncing: true });
};

function calculateStreaks(dates) {
  if (dates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const uniqueDays = [...new Set(dates.map((d) => d.toISOString().slice(0, 10)))].sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  let currentStreak = 0;
  if (uniqueDays[0] === today || uniqueDays[0] === yesterday) {
    let prev = uniqueDays[0];
    currentStreak = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      const diff = (new Date(prev).getTime() - new Date(uniqueDays[i]).getTime()) / 86400000;
      if (diff === 1) {
        currentStreak++;
        prev = uniqueDays[i];
      } else break;
    }
  }

  let longestStreak = 0;
  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const diff = (new Date(uniqueDays[i - 1]).getTime() - new Date(uniqueDays[i]).getTime()) / 86400000;
    if (diff === 1) {
      streak++;
      longestStreak = Math.max(longestStreak, streak);
    } else {
      streak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, streak, currentStreak);

  return { currentStreak, longestStreak };
}

export const updateProfile = async (req, res) => {
  const { avatarUrl, bio, email } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    if (bio !== undefined) user.bio = bio;
    if (email !== undefined) user.email = email;
    await user.save();
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        role: user.role,
        contributionScore: user.contributionScore,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
