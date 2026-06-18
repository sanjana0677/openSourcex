import mongoose from 'mongoose';
import User from '../models/User.js';
import Contribution from '../models/Contribution.js';
import Repository from '../models/Repository.js';

export const getInsights = async (req, res) => {
  const userId = req.userId;
  const objectId = new mongoose.Types.ObjectId(userId);

  const user = await User.findById(userId).select('contributionScore');
  const total = await Contribution.countDocuments({ userId });

  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  const recent = await Contribution.countDocuments({
    userId,
    contributionDate: { $gte: last30Days },
  });

  const langRows = await Repository.aggregate([
    { $match: { userId: objectId, language: { $ne: null } } },
    { $group: { _id: '$language', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);
  const topLanguages = langRows.map((r) => r._id ?? 'Unknown');

  const mergedPRCount = await Contribution.countDocuments({
    userId,
    type: 'pull_request',
    merged: true,
  });

  const productivityScore = Math.min(100, Math.round((recent / 30) * 100));
  const impactScore = Math.min(100, Math.round(Math.sqrt(mergedPRCount * 10 + total) * 5));
  const consistencyScore = Math.min(100, Math.round((recent > 0 ? recent / 30 : 0) * 100));

  const recommendations = [];
  if (recent < 5) recommendations.push('Try to contribute daily to build momentum');
  if (mergedPRCount < 3) recommendations.push('Open more pull requests to increase your impact score');
  if (topLanguages.length < 2) recommendations.push('Explore projects in new programming languages');
  if (total < 10) recommendations.push('Contribute to beginner-friendly open source repositories');
  recommendations.push('Star and watch repositories in your favorite technologies');

  const strengths = [];
  if (productivityScore >= 70) strengths.push('Consistent daily contributions');
  if (mergedPRCount >= 5) strengths.push('Strong pull request track record');
  if (topLanguages.length >= 3) strengths.push('Multi-language proficiency');
  if (total >= 50) strengths.push('High overall contribution volume');
  if (strengths.length === 0) strengths.push('Getting started on your open source journey');

  const improvements = [];
  if (productivityScore < 50) improvements.push('Increase contribution frequency');
  if (impactScore < 40) improvements.push('Focus on high-impact repositories');
  if (consistencyScore < 30) improvements.push('Build a daily contribution habit');

  res.json({
    productivityScore,
    impactScore,
    consistencyScore,
    recommendations: recommendations.slice(0, 5),
    topLanguages,
    strengths,
    improvements,
    summary: `You've made ${total} contributions total, with ${recent} in the last 30 days. Your strongest languages are ${topLanguages.slice(0, 3).join(', ') || 'yet to be determined'}.`,
    generatedAt: new Date(),
  });
};
