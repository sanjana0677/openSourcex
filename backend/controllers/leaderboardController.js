import mongoose from 'mongoose';
import User from '../models/User.js';
import Contribution from '../models/Contribution.js';

export const getLeaderboard = async (req, res) => {
  const { period, limit = 20 } = req.query;

  let dateFilter = {};
  if (period === 'weekly') {
    dateFilter = { contributionDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
  } else if (period === 'monthly') {
    dateFilter = { contributionDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
  }

  
  const users = await User.find()
    .select('username avatarUrl contributionScore')
    .sort({ contributionScore: -1 })
    .limit(Number(limit));

  const result = await Promise.all(
    users.map(async (user, i) => {
      const contribFilter = { userId: user._id, ...dateFilter };
      const totalCommits = await Contribution.countDocuments({ ...contribFilter, type: 'commit' });
      const totalPullRequests = await Contribution.countDocuments({ ...contribFilter, type: 'pull_request' });
      const totalIssues = await Contribution.countDocuments({ ...contribFilter, type: 'issue' });

      return {
        rank: i + 1,
        userId: user._id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        contributionScore: user.contributionScore,
        totalCommits,
        totalPullRequests,
        totalIssues,
      };
    })
  );

  res.json(result);
};
