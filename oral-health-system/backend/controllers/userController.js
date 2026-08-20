import User from '../models/User.js';

export async function getUsers(req, res, next) {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req, res, next) {
  try {
    const updates = (({ fullName, phone, language, theme, notificationsEnabled, avatarUrl }) =>
      ({ fullName, phone, language, theme, notificationsEnabled, avatarUrl }))(req.body);
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateUserStatus(req, res, next) {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
}
