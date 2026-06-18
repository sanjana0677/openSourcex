import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['commit', 'pull_request', 'issue', 'review'],
      required: true,
    },
    title: {
      type: String,
      default: '',
      maxlength: 255,
    },
    repoName: {
      type: String,
      default: '',
    },
    repoOwner: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },
    state: {
      type: String,
      default: null,
    },
    merged: {
      type: Boolean,
      default: false,
    },
    contributionDate: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

contributionSchema.index({ userId: 1, contributionDate: -1 });

const Contribution = mongoose.model('Contribution', contributionSchema);
export default Contribution;
