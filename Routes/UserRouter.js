import express from 'express'
import { DeleteUser, followUser, getAllUser, getUser, UnFollowUser, UpdateUser } from '../Controller/UserController.js';
import authMiddleWare from '../MiddleWare/authMiddleWare.js';
const router = express.Router();


router.get('/', getAllUser)
router.get('/:id', getUser)
router.put('/:id', authMiddleWare, UpdateUser)
router.delete('/:id', authMiddleWare, DeleteUser)
router.put('/:id/follow', authMiddleWare, followUser)
router.put('/:id/unfollow', authMiddleWare, UnFollowUser)

export default router;