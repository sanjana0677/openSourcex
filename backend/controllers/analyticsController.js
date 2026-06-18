import mongoose from 'mongoose';
import Contribution from '../models/Contribution.js';
import Repository from '../models/Repository.js';

export const getHeatmap = async (req, res) => {
  const userId = await _toObjectId(req.userId);
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const contribs = await Contribution.aggregate([
    {
      $match: {
        userId,
        contributionDate: { $gte: oneYearAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$contributionDate' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const countMap = new Map();
  for (const row of contribs) countMap.set(row._id, row.count);
  const maxCount = Math.max(...Array.from(countMap.values()), 1);

  const result = [];
  const cursor = new Date(oneYearAgo);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  while (cursor <= end) {
    const dateStr = cursor.toISOString().slice(0, 10);
    const count = countMap.get(dateStr) ?? 0;
    const level =
      count === 0 ? 0 : count <= maxCount * 0.25 ? 1 : count <= maxCount * 0.5 ? 2 : count <= maxCount * 0.75 ? 3 : 4;
    result.push({ date: dateStr, count, level });
    cursor.setDate(cursor.getDate() + 1);
  }

  res.json(result);
};

export const getMonthly = async (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const userId = await _toObjectId(req.userId);

  const rows = await Contribution.aggregate([
    {
      $match: {
        userId,
        contributionDate: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year + 1}-01-01`),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: '$contributionDate' }, type: '$type' },
        count: { $sum: 1 },
      },
    },
  ]);

  const monthMap = new Map();
  for (let m = 1; m <= 12; m++) {
    const monthName = new Date(year, m - 1, 1).toLocaleString('en-US', { month: 'short' });
    monthMap.set(m, { month: monthName, year, commits: 0, pullRequests: 0, issues: 0 });
  }

  for (const row of rows) {
    const entry = monthMap.get(row._id.month);
    if (!entry) continue;
    if (row._id.type === 'commit') entry.commits += row.count;
    else if (row._id.type === 'pull_request') entry.pullRequests += row.count;
    else if (row._id.type === 'issue') entry.issues += row.count;
  }

  res.json(Array.from(monthMap.values()));
};

export const getLanguages = async (req, res) => {
  const userId = await _toObjectId(req.userId);

  const langRows = await Repository.aggregate([
    { $match: { userId, language: { $ne: null } } },
    { $group: { _id: '$language', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const total = langRows.reduce((sum, r) => sum + r.count, 0) || 1;

  res.json(
    langRows.map((r) => ({
      language: r._id ?? 'Unknown',
      count: r.count,
      percentage: Math.round((r.count / total) * 100 * 10) / 10,
    }))
  );
};

export const getActivity = async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const userId = req.userId;

  const activities = await Contribution.find({ userId }).sort({ contributionDate: -1 }).limit(limit);

  res.json(
    activities.map((a) => {
      let type = a.type;
      if (a.type === 'pull_request') type = a.merged ? 'pull_request_merged' : 'pull_request_opened';
      else if (a.type === 'issue') type = a.state === 'closed' ? 'issue_closed' : 'issue_created';
      else if (a.type === 'review') type = 'review_submitted';
      return {
        id: a._id,
        type,
        title: a.title,
        repoName: a.repoName,
        repoOwner: a.repoOwner,
        url: a.url,
        createdAt: a.contributionDate,
      };
    })
  );
};

export const getStreaks = async (req, res) => {
  const userId = req.userId;
  const contributions = await Contribution.find({ userId }).select('contributionDate').sort({ contributionDate: -1 });

  const dates = contributions.map((c) => c.contributionDate);
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

  let longestStreak = currentStreak;
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

  const last7 = new Set([...Array(7)].map((_, i) => new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)));
  const last30 = new Set([...Array(30)].map((_, i) => new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)));

  res.json({
    currentStreak,
    longestStreak,
    weeklyStreak: uniqueDays.filter((d) => last7.has(d)).length,
    monthlyStreak: uniqueDays.filter((d) => last30.has(d)).length,
    totalActiveDays: uniqueDays.length,
    lastContributionDate: uniqueDays[0] ?? null,
  });
};


function _toObjectId(id) {
  return new mongoose.Types.ObjectId(id);
}
