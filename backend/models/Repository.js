import mongoose from 'mongoose';

const repositorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    githubRepoId: {
      type: String,
      required: true,
    },
    repoName: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    language: {
      type: String,
      default: null,
    },
    stars: {
      type: Number,
      default: 0,
    },
    forks: {
      type: Number,
      default: 0,
    },
    openIssues: {
      type: Number,
      default: 0,
    },
    commitCount: {
      type: Number,
      default: 0,
    },
    pullRequestCount: {
      type: Number,
      default: 0,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

repositorySchema.index({ userId: 1, githubRepoId: 1 }, { unique: true });

const Repository = mongoose.model('Repository', repositorySchema);
export default Repository;
