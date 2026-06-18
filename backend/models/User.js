import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    githubId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: null,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    followers: {
      type: Number,
      default: 0,
    },
    following: {
      type: Number,
      default: 0,
    },
    githubUrl: {
      type: String,
      default: null,
    },
    githubAccessToken: {
      type: String,
      default: null,
    },
    contributionScore: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ['contributor', 'maintainer', 'admin'],
      default: 'contributor',
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
