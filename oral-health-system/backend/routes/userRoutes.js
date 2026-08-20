import express from 'express';
import { protect, requireRole } from '../middleware/auth.js';
import { getUsers, getMe, updateMe, updateUserStatus, deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.get('/', protect, requireRole('admin'), getUsers);
router.put('/:id/status', protect, requireRole('admin'), updateUserStatus);
router.delete('/:id', protect, requireRole('admin'), deleteUser);

export default router;
