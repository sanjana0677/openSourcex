import Notification from '../models/Notification.js';

export const listNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.userId })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(
    notifications.map((n) => ({
      id: n._id,
      message: n.message,
      type: n.type,
      isRead: n.isRead,
      createdAt: n.createdAt,
    }))
  );
};

export const markRead = async (req, res) => {
  const updated = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { isRead: true },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ error: 'Notification not found' });
  }

  res.json({
    id: updated._id,
    message: updated.message,
    type: updated.type,
    isRead: updated.isRead,
    createdAt: updated.createdAt,
  });
};

export const markAllRead = async (req, res) => {
  await Notification.updateMany({ userId: req.userId }, { isRead: true });
  res.json({ message: 'All notifications marked as read' });
};
