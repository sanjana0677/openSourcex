import User from '../models/User.js';
import Repository from '../models/Repository.js';
import Contribution from '../models/Contribution.js';
import logger from '../utils/logger.js';

export async function syncUserData(userId) {
  try {
    const user = await User.findById(userId).select('githubAccessToken username');
    if (!user?.githubAccessToken) return;

    const token = user.githubAccessToken;
    const headers = { Authorization: `Bearer ${token}`, 'User-Agent': 'OpenSourceX' };

    
    const reposRes = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', { headers });
    const repos = await reposRes.json();

    if (Array.isArray(repos)) {
      for (const repo of repos.slice(0, 50)) {
        const repoData = {
          userId,
          githubRepoId: String(repo.id),
          repoName: repo.name,
          owner: repo.owner.login,
          description: repo.description,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          openIssues: repo.open_issues_count,
          updatedAt: new Date(repo.updated_at),
        };

        await Repository.findOneAndUpdate(
          { userId, githubRepoId: String(repo.id) },
          repoData,
          { upsert: true, new: true }
        );
      }
    }

    
    const eventsRes = await fetch(
      `https://api.github.com/users/${user.username}/events/public?per_page=100`,
      { headers }
    );
    const events = await eventsRes.json();

    if (Array.isArray(events)) {
      for (const event of events.slice(0, 100)) {
        const parts = event.repo.name.split('/');
        const owner = parts[0] ?? '';
        const repoName = parts[1] ?? event.repo.name;

        let type = null;
        let title = '';
        let url = `https://github.com/${event.repo.name}`;

        if (event.type === 'PushEvent') {
          type = 'commit';
          title = (event.payload.commits ?? [])[0]?.message ?? 'Pushed code';
        } else if (event.type === 'PullRequestEvent') {
          type = 'pull_request';
          const pr = event.payload.pull_request;
          title = pr?.title ?? 'Pull request';
          url = pr?.html_url ?? url;
        } else if (event.type === 'IssuesEvent') {
          type = 'issue';
          const issue = event.payload.issue;
          title = issue?.title ?? 'Issue';
          url = issue?.html_url ?? url;
        } else if (event.type === 'PullRequestReviewEvent') {
          type = 'review';
          title = 'Submitted a review';
        }

        if (!type) continue;

        const existing = await Contribution.findOne({ githubId: event.id });
        if (!existing) {
          await Contribution.create({
            userId,
            type,
            title: title.slice(0, 255),
            repoName,
            repoOwner: owner,
            url,
            githubId: event.id,
            contributionDate: new Date(event.created_at),
          });
        }
      }
    }

    
    const totalContribs = await Contribution.countDocuments({ userId });
    await User.findByIdAndUpdate(userId, { contributionScore: totalContribs * 10 });
  } catch (err) {
    logger.error('GitHub sync error:', err.message);
  }
}
