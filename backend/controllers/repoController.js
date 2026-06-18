import Repository from '../models/Repository.js';

export const listRepos = async (req, res) => {
  const userId = req.userId;
  const { search, language, sort = 'updatedAt', order = 'desc' } = req.query;

  const filter = { userId };
  if (search) {
    filter.repoName = { $regex: search, $options: 'i' };
  }
  if (language) {
    filter.language = language;
  }

  const sortField =
    sort === 'stars' ? 'stars' : sort === 'commits' ? 'commitCount' : sort === 'name' ? 'repoName' : 'updatedAt';
  const sortOrder = order === 'asc' ? 1 : -1;

  const repos = await Repository.find(filter).sort({ [sortField]: sortOrder });

  res.json(
    repos.map((r) => ({
      id: r._id,
      githubRepoId: r.githubRepoId,
      repoName: r.repoName,
      owner: r.owner,
      description: r.description,
      stars: r.stars,
      forks: r.forks,
      language: r.language,
      openIssues: r.openIssues,
      commitCount: r.commitCount,
      pullRequestCount: r.pullRequestCount,
      updatedAt: r.updatedAt,
    }))
  );
};

export const getRepo = async (req, res) => {
  const repo = await Repository.findOne({ _id: req.params.id, userId: req.userId });
  if (!repo) {
    return res.status(404).json({ error: 'Repository not found' });
  }
  res.json({
    id: repo._id,
    githubRepoId: repo.githubRepoId,
    repoName: repo.repoName,
    owner: repo.owner,
    description: repo.description,
    stars: repo.stars,
    forks: repo.forks,
    language: repo.language,
    openIssues: repo.openIssues,
    commitCount: repo.commitCount,
    pullRequestCount: repo.pullRequestCount,
    updatedAt: repo.updatedAt,
  });
};
