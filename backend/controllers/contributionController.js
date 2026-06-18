import Contribution from '../models/Contribution.js';

export const listContributions = async (req, res) => {
  const userId = req.userId;
  const { type, from, to, limit = 50, offset = 0 } = req.query;

  const filter = { userId };
  if (type) filter.type = type;
  if (from) filter.contributionDate = { ...filter.contributionDate, $gte: new Date(from) };
  if (to) filter.contributionDate = { ...filter.contributionDate, $lte: new Date(to) };

  const contributions = await Contribution.find(filter)
    .sort({ contributionDate: -1 })
    .limit(Number(limit))
    .skip(Number(offset));

  res.json(
    contributions.map((c) => ({
      id: c._id,
      type: c.type,
      title: c.title,
      repoName: c.repoName,
      repoOwner: c.repoOwner,
      url: c.url,
      state: c.state,
      merged: c.merged,
      createdAt: c.contributionDate,
    }))
  );
};
