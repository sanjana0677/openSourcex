import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    format: {
      type: String,
      enum: ['pdf', 'csv'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'ready', 'failed'],
      default: 'ready',
    },
    period: {
      type: String,
      enum: ['week', 'month', 'quarter', 'year', 'all_time'],
      default: 'all_time',
    },
    downloadUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;
